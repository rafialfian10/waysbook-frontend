/* eslint-disable no-lone-blocks */
/* eslint-disable array-callback-return */
// components react bootstrap
import { Button, Card, Form } from "react-bootstrap";
import { Pagination } from "swiper";

// component
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Popup from "../popup/Popup";

// api
import { API } from "../../config/api";

// scss
import "./Cards.scss";
import Swal from "sweetalert2";
import "swiper/css";
import "swiper/css/pagination";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

const Cards = () => {

    const navigate = useNavigate()

    // state popup
    const [popup, setPopup] = useState(false)

    // books promo
    let { data: booksPromo, refetch: refetchBookPromo } = useQuery('booksPromoCache', async () => {
        const response = await API.get(`/books-promo`);
        return response.data.data;
    });
    
    const handleBookPromo = async (id) => {
        try {
          const data = {
            book_id: id,
          }
    
          const body = JSON.stringify(data)
    
          await API.post("/cart", body)
          setPopup(true)
          refetchBookPromo()

        } catch (error) {
          console.log(error)
        }
      }
    // handler show login (jika belum login maka lempar kembali ke halaman home)
    const showLogin = () => {
    let token = localStorage.getItem("token")
        if(!token) {     
            //alert
            Swal.fire({
                text: 'Please login account',
                icon: 'warning',
                confirmButtonText: 'Ok'
            })
            navigate("/")  
        } 
    }

    return (
        <>
            <Popup popup={popup} setPopup={setPopup} />
            <Popup popup={popup} setPopup={setPopup} />
            <Swiper slidesPerView={3} spaceBetween={30} pagination={{ clickable: true}} modules={[Pagination]}className="mySwiper container-card-slider">
                <SwiperSlide className="sub-content-card">
                    {booksPromo?.map((book, i) => {
                        return (
                            <>
                            <Card className="book-container-promo" key={i}>
                                <Card.Img variant="top" src={book.thumbnail} className="card-image" />
                                <Card.Body className="book-desc">
                                    <Card.Title className="book-title">{book.title}</Card.Title>
                                    <Form.Text className="author">By. {book.author}</Form.Text>
                                    <Card.Text className="desc">{book.description}</Card.Text>
                                    <div className="price-container">
                                        <Form.Text className="price">Rp. {book.price.toLocaleString()}</Form.Text>
                                        <Button className="btn-book" onClick={() => {setPopup(); handleBookPromo(book.id); showLogin()}}>Add to Cart</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                            </>                          
                        )
                    })}    
                </SwiperSlide>
            </Swiper>
        </> 
  );
};

export default Cards;

        

      
