import React from "react";
import { Link } from "react-router-dom";
import './FoodMenu.css'; 
import {
  Card,
  CardBody,
  CardTitle,
  ListGroup,
  ListGroupItem
} from "reactstrap";

function Menu({ items, title }) {
  return (
    <section className="col-md-4">
      <Card>
        <CardBody>
          <CardTitle className="font-weight-bold text-center">{title}</CardTitle>
          <ListGroup>
            {items.map(item => (
              <Link to={`/${title.toLowerCase()}/${item.id}`} key={item.id}>
                <ListGroupItem>{item.name}</ListGroupItem>
              </Link>
            ))}
          </ListGroup>
        </CardBody>
      </Card>
    </section>
  );
}

export default Menu;
