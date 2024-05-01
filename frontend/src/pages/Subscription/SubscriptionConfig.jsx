import React from "react";
import SubscriptionDuration from "./SubscriptionDuration";
import SubscriptionDeliveryPattern from "./SubscriptionDeliveryPattern";
import DeliveryFrequency from "./DeliveryFrequency";

const SubscriptionConfig = () => {
  return (
    <>
      <SubscriptionDuration />
      <DeliveryFrequency  />
      <SubscriptionDeliveryPattern />
    </>
  );
};

export default SubscriptionConfig;
