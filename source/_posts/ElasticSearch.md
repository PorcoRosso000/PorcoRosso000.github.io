---
title: ElasticSearch
typora-root-url: ElasticSearch
abbrlink: d48132d3
date: 2022-11-26 16:54:03
tags:
permalink:
---



# ElasticSearch

ES 的语法遵循 RESTfull 风格，PATH的资源结构为 /[index]/[type]/[document]  

es是一个开源的高扩展的分布式全文检索引擎  

index索引就是一个拥有几分相似特征的文档的集合  

type类型在一个索引中，你可以定义一种或多种类型。一个类型是你的索引的一个逻辑上的分类/分区，其语义完全由你来定  

Filed字段 相当于是数据表的字段，对文档数据根据不同属性进行的分类标识 。  

映射mapping是处理数据的方式和规则方面做一些限制，如某个字段的数据类型、默认值、分析器、是否被索引等等  

## ElasticSearch  倒排索引

正常我们查询数据的方式是key-->value（正向索引） value-->key（反向索引）    

倒排索引是通过value中的关键字→key → 再找到对应的数据  

在单词词典中出现的单词对应单词本身的一些信息还有指向倒排列表的指针，通过倒排列表记载 的出现过某个单词的所有文档的文档列表及单词在该文档中出现的位置信息 获取到 哪些文档包含某个单词，将这些文档作为一个个的倒排项，顺序的存储在倒排文件中，之后通过关键字查询就可以直接获取数据

倒排索引  

倒排索引是实现“单词-文档矩阵”的一种具体存储形式，通过倒排索引，可以根据单词快速获取包含这个单词的文档列表。倒排索引主要由两个部分组成：“单词词典”和“倒排文件”。

 单词词典(Lexicon)：搜索引擎的通常索引单位是单词，单词词典是由文档集合中出现过的所有单词构成的字符串集合，单词词典内每条索引项记载单词本身的一些信息以及指向“倒排列表”的指针。
 倒排列表(PostingList)：倒排列表记载了出现过某个单词的所有文档的文档列表及单词在该文档中出现的位置信息，每条记录称为一个倒排项(Posting)。根据倒排列表，即可获知哪些文档包含某个单词。
 倒排文件(Inverted File)：所有单词的倒排列表往往顺序地存储在磁盘的某个文件里，这个文件即被称之为倒排文件，倒排文件是存储倒排索引的物理文件。

倒排索引包含的信息为(文档ID，单词频次，<单词位置>)，比如单词“乔布斯”对应的倒排索引里的第一项(1;1;<1>)意思是，文档1包含了“乔布斯”，并且在这个文档中只出现了1次，位置在第一个。

## 从 Lucene到 Elasticsearch

通过自己封装的 Engine 层，屏蔽了 Lucene 的底层复杂的操作；

 通过集群架构，构建了一套高性能、高可靠的搜索系统；

 Shay 把原本复杂、上手难度极大的 搜索库 Lucene，打造为了对使用者非常友好的 Elasticsearch。



## es实现分页查询的几种方式



es实现分页查询，在ES中有三种方式可以实现分页：from+size、scroll、search_after

### 1.from+size 分页



```php
public function list(Request $request)
    {
        $params = [
            'size' => $request->limit,
            'from' => ($request->page - 1) * $request->limit,
            'index' => $this->index,
            'type' => $this->type,
        ];

        $response = app('es')->search($params);

        return $response['hits']['hits'];
    }
```

- 在使用过程中，有一些典型的使用场景，比如分页、遍历等。在使用关系型数据库中，我们被告知要注意甚至被明确禁止使用深度分页，同理，在 Elasticsearch 中，也应该尽量避免使用深度分页。es为了性能，限制了我们分页的深度，es目前支持的最大的 max_result_window = 10000；from+size二者之和不能超过1w，也就是说我们不能分页到1w条数据以上。
- from+size分页原理很简单，比如需要查询10条数据,es则需要执行from+size条数据然后根据偏移量截断前N条处理后返回。随着偏移量的增大这个时间会呈几何式增长。

### 如何解决from+size 分页带来的性能问题

- 1.在业务逻辑上禁止深度分页，比如不允许查询100页以后的数据
- 2.更换分页方式，采用游标 scroll的方式

### 2.游标 scroll 分页

- Scroll往往是应用于后台批处理任务中，不能用于实时搜索，因为这个scroll相当于维护了一份当前索引段的快照信息，这个快照信息是你执行这个scroll查询时的快照。在这个查询后的任何新索引进来的数据，都不会在这个快照中查询到。但是它相对于from和size，不是查询所有数据然后剔除不要的部分，而是记录一个读取的位置，保证下一次快速继续读取。查询时会自动返回一个_scroll_id，通过这个id可以继续查询



```php
public function list(Request $request)
    {
        if (!isset($request->scroll_id)) {
            $params = [
                'scroll' => '30s',  //快照存活的时间  1m ->一分钟
                'size' => $request->limit,
                'index' => $this->index,
                'type' => $this->type,
            ];
            $response = app('es')->search($params);
        } else {
            $response = app('es')->scroll([
                'scroll_id' => $request->scroll_id,  //...using our previously obtained _scroll_id
                'scroll' => '30s',           // and the same timeout window
                ]
            );
        }

        return [
            'scroll_id' => $response['_scroll_id'],
            'data' => $response['hits']['hits'],
        ];
    }
```

### 游标 scroll 带来的问题

这种分页方式虽然查询变快了，但滚动上下文代价很高，每一个 scroll_id 不仅会占用大量的资源（特别是排序的请求），而且是生成的历史快照，对于数据的变更不会反映到快照上,那么在实时情况下如果处理深度分页的问题呢？es 给出了 search_after 的方式，这是在 >= 5.0 版本才提供的功能。

### 3.search_after分页

searchAfter的方式通过维护一个实时游标来避免scroll的缺点，它可以用于实时请求和高并发场景。
search_after的理念是，=在不同分片上（假设有5个分片），先按照指定顺序排好，根据我们传的search_after值 ，然后仅取这个值之后的size个文档。这 5*size 个文档拿到Es内存中排序后，返回前size个文档即可。避免了浅分页导致的内存爆炸情况，经实际使用性能良好,ES空闲状态下查询耗时稳定在50ms以内，平均10~20ms。



```php
    public function list(Request $request)
    {
        if (!isset($request->search_after)) {
            $params = [
                'size' => $request->limit,
                'index' => $this->index,
                'type' => $this->type,
                'body' => [
                    'sort' => [
                        [
                            '_id' => 'desc',
                        ],
                    ],
                ],
            ];
        } else {
            $params = [
                'size' => $request->limit,
                'index' => $this->index,
                'type' => $this->type,
                'body' => [
                    'sort' => [
                        [
                            '_id' => 'desc',
                        ],
                    ],
                    'search_after' => [$request->search_after],
                ],
            ];
        }
        $response = app('es')->search($params);

        return [
            //项目中需优化数组溢出，此处仅为简单演示
            'search_after' => $response['hits']['hits'][count($response['hits']['hits']) - 1]['sort'][0], 
            'data' => $response['hits']['hits'],
        ];
```

- 注意：
  - 当我们使用search_after时，from值必须设置为0或者-1（当然你也可以不设置这个from参数）。
  - 当存在search_after参数时，不允许出现scroll参数

### search_after 带来的问题

ElasticSearch之Search_After的注意事项

1.搜索时，需要指定sort,并且保证值是唯一的（可以通过加入_id或者文档body中的业务唯一值来保证）；
2.再次查询时，使用上一次最后一个文档的sort值作为search_after的值来进行查询；
3.不能使用随机跳页，只能是下一页或者小范围的跳页（一次查询出小范围内各个页数，利用缓存等技术，来实现小范围分页，比较麻烦，比如从第一页调到第五页，则依次查询出2,3,4页的数据，利用每一次最后一个文档的sort值进行下一轮查询，客户端或服务端都可以进行，如果跳的比较多，则可能该方法并不适用）
它与滚动API非常相似，但与它不同，search_after参数是无状态的，它始终针对最新版本的搜索器进行解析。因此，排序顺序可能会在步行期间发生变化，具体取决于索引的更新和删除

### 总结

from+ size 分页，如果数据量不大或者from、size不大的情况下，效率还是蛮高的。但是在深度分页的情况下，这种使用方式效率是非常低的，并发一旦过大，还有可能直接拖垮整个ElasticSearch的集群。
scroll 分页通常不会用在客户端，因为每一个 scroll_id 都会占用大量的资源，一般是后台用于全量读取数据使用
search_after通过维护一个实时游标来避免scroll的缺点，它可以用于实时请求和高并发场景，一般用于客户端的分页查询
大体而言就是在这三种分页方式中，from + size不适合数据量很大的场景，scroll不适合实时场景，而search after在es5.x版本之后应运而生，较好的解决了这个问题。

