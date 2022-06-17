import {React,useEffect,useReducer} from 'react'
import {useParams,useNavigate} from "react-router-dom";
import axios from "axios"
//import logger from "use-reducer-logger"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import ListGroup from "react-bootstrap/ListGroup"
import Rating from "../components/rating"
import Card from "react-bootstrap/Card"
import Badge from "react-bootstrap/Badge"
import Button  from "react-bootstrap/Button"
import {Helmet} from "react-helmet-async"
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/loadingbox';
import getError from '../util';
import { useContext } from 'react';
import {Store} from "../store"

const  reducer =(state,action) =>
{
  switch(action.type){
    case 'FETCH_REQUEST':
      return {...state,loading: true};
      
    case 'FETCH_SUCCESS':
      return {...state,product :action.payload,loading:false};
    case'FETCH_FAIL':
      return {...state,loading:false,error:action.payload};
    default:
      return state;
  }
};
export  const Productscreen = () => {
    const params=useParams()
    const navigate = useNavigate();
    const {slug}=params;
    const [{loading, error ,product},dispatch]=useReducer(reducer,{
      loading:true,error:'',product:[],
    })
    //const [products,setProducts]=useState([]);
    useEffect(()=>{
      const fetchData = async () =>
      {  
        dispatch ({type: 'FETCH_REQUEST'});
        try{
          const result= await axios.get(`/api/product/slug/${slug}`);
       
          dispatch ({type:'FETCH_SUCCESS',payload: result.data});
         }
       catch (err)
       {
         dispatch ({type: 'FETCH_FAIL',payload:getError(err)})
       }
  
      };
      fetchData();
    } ,[slug]);
    const {state,dispatch:ctxDispatch} =useContext(Store);
    const {cart} =state;
    
    const addToCartHandler =async  () => {
      
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    console.log({existItem});
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
     
    if (data.countInstock < quantity) {
      
      window.alert('Sorry. Product is out of stock');
      return;
    }
   
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        
        payload: { ...product, quantity },
      });
      navigate("/cart")
    };
    return (
      
     loading ? (<LoadingBox></LoadingBox>)
    :error ? (<MessageBox variant="danger"> {error}</MessageBox>)
    :(
      <div> 
        <Row>
          <Col md={3}>
            <img 
            className="img-large"
            src={product.image}
            alt={product.name}
            /> 
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Helmet>
                    <title>
                      {product.name}
                    </title>
                  </Helmet>
                  <h1>{product.name}
                  </h1>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating rating={product.rating} numReviews={product.numReviews}>

                  </Rating>
                </ListGroup.Item>
                <ListGroup.Item>
                  Price :$ {product.price}
                </ListGroup.Item>
                <ListGroup.Item>
                  <p>Description : {product.description}</p>
                </ListGroup.Item>
              </ListGroup>
              </Col>
              <Col md={3}>
                <Card >
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <Row>
                          <Col>
                          Price:</Col>
                          <Col>
                          ${product.price}</Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>
                          Status</Col>
                          <Col>
                          ${product.countInstock >0 ?(
                            <Badge bg="success">In Stock</Badge>)
                            :
                            (<Badge bg="danger" > Unavailable</Badge>
                          )}</Col>
                        </Row>
                        <Row>
                        <ListGroup.Item>
                  {product.countInstock >0 && (
                    <ListGroup.Item>
                      
                      <div className="d-grid">
                        <Button onClick = {addToCartHandler} variant="primary">Add to Cart</Button>
                      </div> </ListGroup.Item>
                  )}
                </ListGroup.Item>
                        </Row>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
                </Col> 
                </Row>
                
                </div>
    ) 
  )  
}
 export default Productscreen;