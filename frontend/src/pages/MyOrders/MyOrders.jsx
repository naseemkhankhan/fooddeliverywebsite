import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from './../../components/context/StoreContext';
import axios from 'axios';
import { assets } from './../../assets/assets';
import ReviewModal from './ReviewModal';
import { Button } from 'react-bootstrap';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedFoodIds, setSelectedFoodIds] = useState([]); // Change to an array

    const fetchOrders = async () => {
        const response = await axios.post(url + '/api/order/userorders', {}, { headers: { token } });
        setData(response.data.data);
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    const handleAddReview = (foodIds) => {
        setSelectedFoodIds(foodIds); // Set food IDs for review
        setShowModal(true);
    };

    const handleSubmitReview = async (foodIds, rating, comment) => {
        const reviewData = {
            product: foodIds,
            rating,
            comment,
        };

        try {
            // Submit the review to your backend
            console.log(reviewData);
            const response = await axios.post(`${url}/api/food/review/`, reviewData, {
                headers: { token }
            });
            alert('Review submitted successfully!'); // Show success message
            console.log(response); // Optionally log the response
            fetchOrders(); // Refetch orders to see new reviews
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.'); // Show error message
        } finally {
            setShowModal(false); // Close the modal after submission
        }
    };

    return (
        <div className='my-orders'>
           
            <div className="container">
            <h2 className='mb-5'>My Orders</h2>
                {data.map((order, index) => (
                    <div key={index} className="my-orders-order">
                        <img src={assets.parcel_icon} alt="" />
                        <p>{order.items.map((item, itemIndex) => (
                           <span key={itemIndex}>
                           {item.name} x {item.quantity}
                           {itemIndex < order.items.length - 1 && <br />}
                         </span>
                         
                        ))}</p>
                        <p>${order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        <p><b>{order.status}</b></p>
                        {order.status === 'Delivered' && (
                            <Button  variant="warning" className='review-header-button' onClick={() => handleAddReview(order.items.map(item => item._id))}>
                                Add Reviews 
                            </Button>
                        )}
                        {order.status !== 'Delivered' && (
                            <Button  variant="warning" className='review-header-button' disabled onClick={() => handleAddReview(order.items.map(item => item._id))}>
                            Add Reviews 
                        </Button>
                        )}
                    </div>
                ))}
            </div>
            {showModal && (
                <ReviewModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmitReview}
                    foodIds={selectedFoodIds} // Pass the array of food IDs
                />
            )}
        </div>
    );
};

export default MyOrders;
