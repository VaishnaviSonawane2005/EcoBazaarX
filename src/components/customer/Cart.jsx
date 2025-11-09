import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { ShoppingBag, Trash2, Plus, Minus, Leaf, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function Cart() {
  const navigate = useNavigate();
  const { items, totalPrice, totalCarbonFootprint, removeFromCart, updateQuantity, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async () => {
    setProcessing(true);
    // Mock checkout process
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success('Order placed successfully!');
    clearCart();
    setProcessing(false);
    navigate('/customer/orders');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingBag className="w-20 h-20 text-gray-400 mb-4" />
        <h2 className="mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Start shopping for eco-friendly products</p>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('/customer/products')}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Shopping Cart ({items.length} items)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <h3 className="line-clamp-1">{item.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.success('Item removed from cart');
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 h-8 text-center"
                        min="1"
                        max={item.stock}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Leaf className="w-3 h-3" />
                        {(item.carbonFootprint * item.quantity).toFixed(2)} kg CO₂
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Total</span>
                <span className="text-emerald-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Total Carbon Footprint</span>
                <Leaf className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl text-emerald-600">
                {totalCarbonFootprint.toFixed(2)} kg CO₂
              </div>
              <p className="text-xs text-gray-600 mt-2">
                That's 45% lower than average online shopping!
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-blue-600">+50</Badge>
                <span className="text-sm">Carbon Points</span>
              </div>
              <p className="text-xs text-gray-600">
                You'll earn points for this eco-friendly purchase
              </p>
            </div>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              size="lg"
              onClick={handleCheckout}
              disabled={processing}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              {processing ? 'Processing...' : 'Proceed to Checkout'}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/customer/products')}
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
