// src/components/customer/OrderDetails.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { 
  Package, Truck, CheckCircle, XCircle, Clock, ArrowLeft, 
  MapPin, Receipt, ShoppingBag, Calendar, Star, Download, 
  Printer, MessageCircle, ChevronDown, ChevronUp, Leaf
} from "lucide-react";

const ordersList = [
  { 
    id: "ORD-2024-001", date: "2024-10-25", status: "delivered", items: 3, total: 89.97, 
    productNames: ["Wireless Mouse", "Keyboard Mat", "USB-C Hub"], 
    trackingNumber: "TRK-001-XYZ", address: "123 Main St, Apt 4B, Springfield, MA 01101",
    carrier: "FedEx", deliveryDate: "2024-10-28", paymentMethod: "Credit Card ending in 4242",
    subtotal: 79.97, shipping: 10.00, tax: 0.00, carbonFootprint: "6.5 kg CO₂"
  },
  { 
    id: "ORD-2024-002", date: "2024-10-20", status: "delivered", items: 2, total: 54.98, 
    productNames: ["Bluetooth Speaker", "Phone Case"], 
    trackingNumber: "TRK-002-ABC", address: "456 Oak Avenue, New York, NY 10001",
    carrier: "UPS", deliveryDate: "2024-10-23", paymentMethod: "PayPal",
    subtotal: 49.98, shipping: 5.00, tax: 0.00, carbonFootprint: "3.7 kg CO₂"
  },
  { 
    id: "ORD-2024-003", date: "2024-10-15", status: "delivered", items: 1, total: 29.99, 
    productNames: ["Wireless Earbuds"], 
    trackingNumber: "TRK-003-DEF", address: "789 Pine Street, Los Angeles, CA 90210",
    carrier: "USPS", deliveryDate: "2024-10-18", paymentMethod: "Credit Card ending in 1234",
    subtotal: 27.99, shipping: 2.00, tax: 0.00, carbonFootprint: "2.5 kg CO₂"
  },
  { 
    id: "ORD-2024-004", date: "2024-10-10", status: "cancelled", items: 2, total: 45.50, 
    productNames: ["Cotton T-Shirt", "Leather Belt"], trackingNumber: null,
    address: "456 Pine Lane, Suburbia, TX 77001", carrier: null, deliveryDate: null,
    paymentMethod: "Credit Card ending in 5678", subtotal: 45.50, shipping: 0.00, tax: 0.00,
    carbonFootprint: "0 kg CO₂"
  },
  { 
    id: "ORD-2024-005", date: "2024-11-01", status: "shipped", items: 1, total: 35.00, 
    productNames: ["Premium Wireless Headphones"], trackingNumber: "TRK-005-GHI",
    address: "789 Oak Ave, Suite 100, Cityville, CA 90210", carrier: "UPS",
    deliveryDate: "2024-11-05", paymentMethod: "PayPal", subtotal: 32.00, shipping: 3.00, tax: 0.00,
    carbonFootprint: "4.2 kg CO₂"
  },
  { 
    id: "ORD-2024-006", date: "2024-11-05", status: "pending", items: 4, total: 120.50, 
    productNames: ["Desk Lamp", "Monitor Stand", "Pen Set", "Cable Ties"], 
    trackingNumber: null, address: "10 Downing St, London, SW1A 2AA, UK", carrier: null,
    deliveryDate: null, paymentMethod: "Credit Card ending in 1234", subtotal: 115.00, shipping: 5.50, tax: 0.00,
    carbonFootprint: "8.1 kg CO₂"
  }
];

const trackingData = {
  delivered: [
    { status: "Order Placed", date: null, description: "We've received your order" },
    { status: "Confirmed", date: null, description: "Order confirmed and processing" },
    { status: "Shipped", date: null, description: "Item has been shipped" },
    { status: "Out for Delivery", date: null, description: "Package is out for delivery" },
    { status: "Delivered", date: null, description: "Delivered to your address" },
  ],
  shipped: [
    { status: "Order Placed", date: null, description: "We've received your order" },
    { status: "Confirmed", date: null, description: "Order confirmed and processing" },
    { status: "Shipped", date: null, description: "Item has been shipped with carrier" },
    { status: "Out for Delivery", date: null, description: "Package will be out for delivery soon" },
    { status: "Delivered", date: null, description: "Expected delivery soon" },
  ],
  pending: [
    { status: "Order Placed", date: null, description: "We've received your order" },
    { status: "Confirmed", date: null, description: "Order being processed" },
    { status: "Shipped", date: null, description: "Item will ship within 2-3 days" },
    { status: "Out for Delivery", date: null, description: "Package will be out for delivery" },
    { status: "Delivered", date: null, description: "Expected delivery soon" },
  ],
  cancelled: [
    { status: "Order Placed", date: null, description: "We've received your order" },
    { status: "Cancelled", date: null, description: "Order was cancelled per your request" },
  ]
};

// Helper function to generate realistic dates based on order date
const generateTimelineDates = (orderDate, status) => {
  const baseDate = new Date(orderDate);
  
  if (status === 'delivered') {
    return [
      { ...trackingData.delivered[0], date: new Date(baseDate) },
      { ...trackingData.delivered[1], date: new Date(baseDate.setDate(baseDate.getDate() + 1)) },
      { ...trackingData.delivered[2], date: new Date(baseDate.setDate(baseDate.getDate() + 1)) },
      { ...trackingData.delivered[3], date: new Date(baseDate.setDate(baseDate.getDate() + 1)) },
      { ...trackingData.delivered[4], date: new Date(baseDate.setDate(baseDate.getDate() + 1)) },
    ];
  } else if (status === 'shipped') {
    return [
      { ...trackingData.shipped[0], date: new Date(baseDate) },
      { ...trackingData.shipped[1], date: new Date(baseDate.setDate(baseDate.getDate() + 1)) },
      { ...trackingData.shipped[2], date: new Date(baseDate.setDate(baseDate.getDate() + 1)) },
      trackingData.shipped[3],
      trackingData.shipped[4],
    ];
  } else if (status === 'pending') {
    return [
      { ...trackingData.pending[0], date: new Date(baseDate) },
      trackingData.pending[1],
      trackingData.pending[2],
      trackingData.pending[3],
      trackingData.pending[4],
    ];
  } else {
    return [
      { ...trackingData.cancelled[0], date: new Date(baseDate) },
      { ...trackingData.cancelled[1], date: new Date(baseDate.setDate(baseDate.getDate() + 1)) },
    ];
  }
};

const ReviewModal = ({ product, isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    onSubmit({ product, rating, review });
    setRating(0);
    setReview("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-bold mb-4">Review {product}</h3>
        <div className="flex space-x-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer ${
                star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <Textarea
          placeholder="Share your experience with this product..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="mb-4"
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={rating === 0}>Submit Review</Button>
        </div>
      </div>
    </div>
  );
};

const TimelineStep = ({ step, index, timelineLength, orderStatus }) => {
  const isCompleted = step.date !== null;
  const isCurrent = !isCompleted && orderStatus !== 'cancelled';
  const isLast = index === timelineLength - 1;
  
  let IconComponent, colorClass, bgClass;

  if (step.status.includes('Cancelled')) {
    IconComponent = XCircle;
    colorClass = "text-red-600";
    bgClass = "bg-red-50";
  } else if (isCompleted) {
    IconComponent = CheckCircle;
    colorClass = "text-green-600";
    bgClass = "bg-green-50";
  } else if (isCurrent) {
    IconComponent = Clock;
    colorClass = "text-blue-600";
    bgClass = "bg-blue-50";
  } else {
    IconComponent = Clock;
    colorClass = "text-gray-400";
    bgClass = "bg-gray-50";
  }

  return (
    <div className={`flex items-start p-4 rounded-lg ${bgClass} relative`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colorClass} bg-white border-2 ${isCompleted ? 'border-green-500' : isCurrent ? 'border-blue-500' : 'border-gray-300'}`}>
        <IconComponent className="w-4 h-4" />
      </div>
      
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-start">
          <h3 className={`font-semibold ${isCompleted ? 'text-gray-900' : isCurrent ? 'text-blue-900' : 'text-gray-500'}`}>
            {step.status}
          </h3>
          {step.date && (
            <span className="text-sm text-gray-500">
              {new Date(step.date).toLocaleDateString("en-US", { 
                month: 'short', 
                day: 'numeric'
              })}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
      </div>

      {!isLast && (
        <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-gray-300"></div>
      )}
    </div>
  );
};

const ProductCard = ({ name, status, onReview, onSupport }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <Badge className={
              status === 'delivered' ? 'bg-green-100 text-green-800' :
              status === 'shipped' ? 'bg-blue-100 text-blue-800' :
              status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }>
              {status}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onSupport}>
            <MessageCircle className="w-4 h-4 mr-1" />
            Support
          </Button>
          {status === 'delivered' && (
            <Button size="sm" onClick={onReview}>
              <Star className="w-4 h-4 mr-1" />
              Review
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Status:</span>
              <p className="font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
            </div>
            <div>
              <span className="text-gray-600">Quantity:</span>
              <p className="font-medium">1</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = ordersList.find((o) => o.id === orderId);
  const [reviewModal, setReviewModal] = useState({ open: false, product: "" });
  const [showSupport, setShowSupport] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <Button onClick={() => navigate(-1)} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> 
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const timeline = generateTimelineDates(order.date, order.status);

  const handleReview = (product) => {
    setReviewModal({ open: true, product });
  };

  const submitReview = (reviewData) => {
    console.log("Review submitted:", reviewData);
    alert(`Thank you for reviewing ${reviewData.product}!`);
  };

  const handleSupport = () => {
    setShowSupport(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("Invoice download functionality would be implemented here");
  };

  const statusColors = {
    delivered: "bg-green-100 text-green-800 border-green-200",
    shipped: "bg-blue-100 text-blue-800 border-blue-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    cancelled: "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600">Order {order.id} • {new Date(order.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Invoice
            </Button>
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Badge className={`text-lg px-4 py-2 ${statusColors[order.status]}`}>
                {order.status.toUpperCase()}
              </Badge>
              <p className="text-gray-600 mt-2">
                {order.status === 'delivered' && order.deliveryDate ? 
                  `Delivered on ${new Date(order.deliveryDate).toLocaleDateString()}` :
                 order.status === 'shipped' && order.deliveryDate ? 
                  `Expected delivery ${new Date(order.deliveryDate).toLocaleDateString()}` :
                 order.status === 'pending' ? 
                  'Processing your order' :
                 'Order was cancelled'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
              <p className="text-gray-600">{order.items} item{order.items > 1 ? 's' : ''}</p>
            </div>
          </div>
          
          {/* Carbon Footprint */}
          <div className="mt-4 flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <Leaf className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-semibold">Carbon Footprint</span>
            </div>
            <span className="text-green-700 font-bold">{order.carbonFootprint}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-blue-600" />
                  Order Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {timeline.map((step, index) => (
                    <TimelineStep
                      key={index}
                      step={step}
                      index={index}
                      timelineLength={timeline.length}
                      orderStatus={order.status}
                    />
                  ))}
                </div>
                {order.trackingNumber && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold">Tracking Number: {order.trackingNumber}</p>
                    <Button className="mt-2 w-full bg-orange-500 hover:bg-orange-600">
                      Track Package on {order.carrier} Website
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2 text-green-600" />
                  Order Items ({order.items})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.productNames.map((name, index) => (
                    <ProductCard
                      key={index}
                      name={name}
                      status={order.status}
                      onReview={() => handleReview(name)}
                      onSupport={handleSupport}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">${order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-red-600" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 font-semibold">Delivery Address</p>
                <p className="text-gray-600 text-sm mt-1">{order.address}</p>
                {order.deliveryDate && (
                  <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                    <p className="text-blue-900 font-semibold text-sm">
                      {order.status === 'delivered' ? 'Delivered' : 'Expected Delivery'}
                    </p>
                    <p className="text-blue-700 text-sm">
                      {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Need Help?</h3>
                  <p className="text-gray-600 text-sm mb-4">We're here to help with your order</p>
                  <Button className="w-full" onClick={handleSupport}>
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReviewModal
        product={reviewModal.product}
        isOpen={reviewModal.open}
        onClose={() => setReviewModal({ open: false, product: "" })}
        onSubmit={submitReview}
      />

      {showSupport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Contact Support</h3>
            <p className="text-gray-600 mb-4">How can we help you with order {order.id}?</p>
            <div className="space-y-3">
              <Input placeholder="Subject" />
              <Textarea placeholder="Describe your issue..." rows={4} />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowSupport(false)}>Cancel</Button>
                <Button onClick={() => {
                  setShowSupport(false);
                  alert("Support request submitted!");
                }}>Send Message</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}