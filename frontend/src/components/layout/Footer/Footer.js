import React from 'react'
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css"

const Footer = () => {
  return (
    <footer id="footer">
        <div className='leftFooter'>
            <h4>Download our App</h4>
            <p>Download our app for android and IOS mobile phone</p>
            <img src={playStore} alt="playstore" />
            <img src={appStore} alt="appstore" />
        </div>

        <div className='midFooter'>
            <h1>ECOMMERCE.</h1>
            <p>High Quality is our first priority</p>
            <p>Copyrights 2023 &copy; Ecommerce</p>
        </div>

        <div className='rightFooter'>
            <h4>Follow Us</h4>
            <a href="http://instagram.com/ecommerce">Instagram</a>
            <a href="http://youtube.com/ecommerce">Youtube</a>
            <a href="http://Facebook.com/ecommerce">Facebook</a>
        </div>

    </footer>
  )
}

export default Footer
