import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";

function Item({ items, cantFind }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the item by its id
  let item = items.find(item => item.id === id);

  // If the item doesn't exist, redirect to the 'cantFind' page
  if (!item) {
    navigate(cantFind); // This will redirect to /snacks or /drinks
    return null; // Don't render anything after redirect
  }

  return (
    <section>
      <Card>
        <CardBody>
          <CardTitle className="font-weight-bold text-center">{item.name}</CardTitle>
          <CardText className="font-italic">{item.description}</CardText>
          <p><b>Recipe:</b> {item.recipe}</p>
          <p><b>Serve:</b> {item.serve}</p>
        </CardBody>
      </Card>
    </section>
  );
}

export default Item;
