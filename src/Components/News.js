import React, {useState , useEffect} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
   
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    // document.title = `NewsCard | ${capitalizeFirstLetter(props.category)}`;

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const capitalizeAllLetter = (string) => {
        return string.toUpperCase();
    }

    // handeling state of first page, content of first page (articles) and loading gif 

    const updateNews = async () => {
        props.setProgress(0);

        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`

        props.setProgress(25);

        let data = await fetch(url);

        props.setProgress(50);

        let parseData =  await data.json();

        props.setProgress(75);

        setArticles(parseData.articles);
        setTotalResults(parseData.totalResults);
        setLoading(false)
        
         
        props.setProgress(100);
    }

    useEffect(() => {
        updateNews();
    }, [])

  
    const fetchMoreData = async () =>{
        
        setPage(page + 1);

        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`

        setLoading(true);

        let data = await fetch(url);
        let parseData = await data.json();

        setArticles(articles.concat(parseData.articles));
        setTotalResults(parseData.totalResults);
        setLoading(false);
        
    }

    
    return (
        <>
            <h1  style={{color: '#f11946', textAlign: 'center', marginTop:"90px"}}> {props.category === "general" ? "TOP BULLETINS":`TOP ${capitalizeAllLetter(props.category)} HEADLINES`}</h1>
                                    
            {setLoading === 'true' ? <Spinner/> : 
            <InfiniteScroll  dataLength={articles.length}  next={fetchMoreData}  hasMore={articles.length !== totalResults}  loader={<Spinner />} >

                <div className="container my-3" >
                    <div className="row">
                        {articles.map((element)=>{
                            return(
                                <div className="col-md-3 my-3" key={element.url}>

                                    <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : element.content} imgUrl={element.urlToImage ? element.urlToImage : "https://media.istockphoto.com/photos/blank-daily-newspaper-picture-id503149471?k=20&m=503149471&s=612x612&w=0&h=vVY5HcbK_-OYJqTsNjZAHFCxil6jaQMVLaypgN_uWDk="} newsUrl={element.url} newsDate={element.publishedAt} author={element.author ? element.author : "Unknown Source"} source={element.source.name}/>

                                </div>
                            )
                        })}
                    </div>  
                </div>

            </InfiniteScroll>  
            }
        </>
    )
}



News.defaultProps = {
    country : 'in',
    pageSize : 12,
    category : 'general',
    setProgress : 0
 };

 News.propTypes = {
     country: PropTypes.string,
     pageSize: PropTypes.number,
     category: PropTypes.string,
     setProgress: PropTypes.func,
 };


 export default News;