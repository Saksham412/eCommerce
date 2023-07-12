import React, { Fragment } from 'react'
// import {CgMouse} from "react-icons/"
import "./Home.css"
import Product from './Product'

const product = {
    name: "Shirt",
    price: 1200,
    _id:"saksham",
    images: [{url:"https://i.ibb.co/DRST11n/1.webp"}],
    description: "Slim fit"
}
const Home = () => {
  return (
    <Fragment>
        <div className='banner'>
            <p>Welcome to Ecommerce</p>

            <a href="#continer">
                <button>
                    Scroll
                </button>
            </a>
        </div>
        <h2 className='homeHeading'>Features Products</h2>
        <div className='container' id='container'>
            <Product product = {product}/>
            <Product product = {product}/>
            <Product product = {product}/>
            <Product product = {product}/>
            <Product product = {product}/>
            <Product product = {product}/>
            <Product product = {product}/>
            <Product product = {product}/>
        </div>
    </Fragment>
  )
}

export default Home
