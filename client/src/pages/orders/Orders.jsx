import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Orders.scss";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/orders`).then((res) => {
        return res.data;
      }),
  });

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId + order.gigId;
    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.seller ? buyerId : sellerId,
          gigId: order.gigId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  const handleChangeStatus = async (order, status) => {
    const updatedOrder = { ...order, isCompleted: status === "Completed" };

    try {
      // Make an API call to update the order status
      const response = await newRequest.put(`/orders/${order._id}/status`, {
        status: updatedOrder.isCompleted,
      });

      // Update the order in the local state
      const updatedData = data.map((o) => {
        if (o._id === order._id) {
          return { ...o, isCompleted: updatedOrder.isCompleted };
        }
        return o;
      });

      // Update the data in the cache
      queryClient.setQueryData(["orders"], updatedData);
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error(error);
    }
  };

  return (
    <div className="orders">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Orders</h1>
          </div>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Status</th>
                <th>Price</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order) => (
                <tr key={order._id}>
                  <td>
                    <img className="image" src={order.img} alt="" />
                  </td>
                  <td>{order.title}</td>
                  {currentUser.isSeller ? (
                    <td>
                      <select
                        value={order.isCompleted ? "Completed" : "In-progress"}
                        onChange={(e) =>
                          handleChangeStatus(order, e.target.value)
                        }
                      >
                        <option value="In-progress">In-progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  ) : (
                    <td>{order.isCompleted ? "Completed" : "In-progress"}</td>
                  )}
                  <td>{order.price}</td>
                  <td>
                    <img
                      className="message"
                      src="./img/message.png"
                      alt=""
                      onClick={() => handleContact(order)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
