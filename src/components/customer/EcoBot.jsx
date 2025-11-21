import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Loader, Zap, ShoppingCart, RefreshCw, Volume2, 
  Pause, ArrowRight, Upload, XCircle, Phone, Sparkles, 
  Search, Leaf, Star, Package, Clock, Shield, Truck,
  MessageCircle, Heart, User, CreditCard, ShieldCheck
} from 'lucide-react';

// --- EcoBazaarX Product Database ---
const ECO_PRODUCTS = [
  { 
    id: 1, 
    name: "Organic Hemp T-Shirt", 
    category: "Apparel", 
    carbon: "1.5 kg CO₂e", 
    price: 35, 
    rating: 4.8,
    reviews: 124,
    features: "100% organic hemp, natural dyes, highly durable, perfect for everyday use",
    benefits: "Saves 3.2kg CO₂ vs cotton, biodegradable, water-efficient",
    imgUrl: "https://placehold.co/400x400/34D399/white?text=Hemp+T-Shirt",
    tags: ["sustainable", "organic", "biodegradable"],
    inStock: true,
    delivery: "2-3 days"
  },
  { 
    id: 2, 
    name: "Reclaimed Wood Desk", 
    category: "Home Office", 
    carbon: "5.8 kg CO₂e", 
    price: 450, 
    rating: 4.9,
    reviews: 89,
    features: "Made from recycled scaffolding wood, low-VOC finish, large workspace",
    benefits: "Prevents deforestation, reduces landfill waste, durable construction",
    imgUrl: "https://placehold.co/400x400/4B5563/white?text=Wood+Desk",
    tags: ["recycled", "durable", "office"],
    inStock: true,
    delivery: "5-7 days"
  },
  { 
    id: 3, 
    name: "Bamboo Toothbrush Pack (4)", 
    category: "Personal Care", 
    carbon: "0.1 kg CO₂e", 
    price: 12, 
    rating: 4.7,
    reviews: 256,
    features: "Biodegradable bamboo handle, BPA-free bristles, eco-friendly packaging",
    benefits: "Reduces plastic waste, compostable, sustainable alternative",
    imgUrl: "https://placehold.co/400x400/84CC16/white?text=Bamboo+Brush",
    tags: ["biodegradable", "zero-waste", "bamboo"],
    inStock: true,
    delivery: "1-2 days"
  },
  { 
    id: 4, 
    name: "Solar-Powered LED Lamp", 
    category: "Electronics", 
    carbon: "3.2 kg CO₂e", 
    price: 89, 
    rating: 4.6,
    reviews: 167,
    features: "Zero external energy required, lasts 50,000 hours, waterproof design",
    benefits: "Energy independent, reduces electricity consumption, long-lasting",
    imgUrl: "https://placehold.co/400x400/FBBF24/black?text=Solar+Lamp",
    tags: ["solar", "energy-saving", "outdoor"],
    inStock: true,
    delivery: "3-4 days"
  },
  { 
    id: 5, 
    name: "Zero-Waste Shopping Bag", 
    category: "Accessories", 
    carbon: "0.5 kg CO₂e", 
    price: 15, 
    rating: 4.5,
    reviews: 312,
    features: "Heavy-duty canvas, machine washable, folds small, reusable",
    benefits: "Eliminates plastic bags, durable, multi-purpose use",
    imgUrl: "https://placehold.co/400x400/059669/white?text=Eco+Bag",
    tags: ["reusable", "zero-waste", "canvas"],
    inStock: true,
    delivery: "2-3 days"
  },
  { 
    id: 6, 
    name: "Organic Cotton Yoga Set", 
    category: "Activewear", 
    carbon: "2.1 kg CO₂e", 
    price: 68, 
    rating: 4.8,
    reviews: 203,
    features: "GOTS certified organic cotton, breathable fabric, sustainable dyes",
    benefits: "Chemical-free, supports organic farming, comfortable fit",
    imgUrl: "https://placehold.co/400x400/EC4899/white?text=Yoga+Set",
    tags: ["organic", "activewear", "GOTS"],
    inStock: true,
    delivery: "2-4 days"
  }
];

// Product lookup map
const PRODUCT_MAP = ECO_PRODUCTS.reduce((map, product) => {
  map[product.id] = product;
  return map;
}, {});

// --- AI Response Generator (Mock) ---
const generateAIResponse = (userMessage, chatHistory) => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Product recommendations based on user queries
  if (lowerMessage.includes('shirt') || lowerMessage.includes('clothing') || lowerMessage.includes('wear')) {
    return {
      text: "Based on your interest in clothing, I recommend our **Organic Hemp T-Shirt**! It's made from sustainable hemp that uses 50% less water than cotton and is completely biodegradable. Perfect for everyday comfort while reducing your environmental impact.",
      recommendedIds: [1],
      type: "product_recommendation"
    };
  }
  
  if (lowerMessage.includes('desk') || lowerMessage.includes('office') || lowerMessage.includes('work')) {
    return {
      text: "For your workspace needs, our **Reclaimed Wood Desk** is an excellent sustainable choice! Crafted from recycled scaffolding wood, each piece is unique and saves trees from being cut down. It's both eco-friendly and built to last for years.",
      recommendedIds: [2],
      type: "product_recommendation"
    };
  }
  
  if (lowerMessage.includes('toothbrush') || lowerMessage.includes('bathroom') || lowerMessage.includes('hygiene')) {
    return {
      text: "For sustainable personal care, our **Bamboo Toothbrush Pack** is perfect! Each brush prevents plastic waste and is completely biodegradable. The bamboo grows rapidly without pesticides, making it an eco-friendly alternative to plastic brushes.",
      recommendedIds: [3],
      type: "product_recommendation"
    };
  }
  
  if (lowerMessage.includes('lamp') || lowerMessage.includes('light') || lowerMessage.includes('solar')) {
    return {
      text: "Looking for sustainable lighting? Our **Solar-Powered LED Lamp** operates completely on solar energy, eliminating electricity costs and carbon emissions. Perfect for outdoor use or as an emergency light source!",
      recommendedIds: [4],
      type: "product_recommendation"
    };
  }
  
  if (lowerMessage.includes('bag') || lowerMessage.includes('shopping') || lowerMessage.includes('carry')) {
    return {
      text: "For sustainable carrying solutions, our **Zero-Waste Shopping Bag** replaces hundreds of plastic bags over its lifetime. Made from durable canvas, it's both practical and environmentally responsible!",
      recommendedIds: [5],
      type: "product_recommendation"
    };
  }
  
  if (lowerMessage.includes('sustainable') || lowerMessage.includes('eco') || lowerMessage.includes('green')) {
    return {
      text: "I'd love to help you find sustainable products! At EcoBazaarX, we carefully select items that minimize environmental impact. Could you tell me what type of product you're looking for? For example: clothing, home goods, personal care, or accessories?",
      recommendedIds: [1, 3, 5],
      type: "general_help"
    };
  }
  
  if (lowerMessage.includes('carbon') || lowerMessage.includes('footprint') || lowerMessage.includes('co2')) {
    return {
      text: "All our products display carbon footprint information! We calculate the total CO₂ emissions from manufacturing to delivery. For example, our Bamboo Toothbrushes have only 0.1 kg CO₂e - 90% less than plastic alternatives!",
      recommendedIds: [3, 1, 5],
      type: "carbon_info"
    };
  }
  
  // Default response
  return {
    text: "I'm here to help you discover sustainable products that match your needs! At EcoBazaarX, we're committed to offering eco-friendly alternatives that don't compromise on quality. What specific products are you interested in today?",
    recommendedIds: [1, 3, 4, 5],
    type: "welcome"
  };
};

// --- Component for Product Cards ---
const ProductCard = ({ product, onNavigate }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer">
      <div className="relative overflow-hidden">
        <img 
          src={product.imgUrl} 
          alt={product.name}
          className={`w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        {/* Carbon Badge */}
        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
          <Leaf className="w-3 h-3 mr-1" />
          {product.carbon}
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
          <Star className="w-3 h-3 mr-1 text-yellow-400 fill-yellow-400" />
          {product.rating}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.features}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-green-600">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
            )}
          </div>
          <span className="text-xs text-gray-500">{product.reviews} reviews</span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <Truck className="w-3 h-3 mr-1" />
            {product.delivery}
          </div>
          <div className="flex items-center">
            <ShieldCheck className="w-3 h-3 mr-1" />
            In Stock
          </div>
        </div>
        
        <button
          onClick={() => onNavigate(product)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center group/btn"
        >
          View Product
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// --- Quick Action Buttons ---
const QuickActions = ({ onAction }) => {
  const actions = [
    { icon: ShoppingCart, text: "Sustainable Products", query: "Show me sustainable products" },
    { icon: Leaf, text: "Low Carbon Items", query: "What are your lowest carbon products?" },
    { icon: Shield, text: "Eco Certification", query: "Tell me about your eco certifications" },
    { icon: User, text: "Size Guide", query: "Do you have a size guide for clothing?" }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => onAction(action.query)}
          className="flex items-center p-3 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors duration-200 group"
        >
          <action.icon className="w-4 h-4 text-green-600 mr-2" />
          <span className="text-sm font-medium text-green-800">{action.text}</span>
        </button>
      ))}
    </div>
  );
};

// --- Chat Bubble Component ---
const ChatBubble = ({ message, onProductNavigate }) => {
  const isBot = message.sender === 'bot';
  const recommendedProducts = isBot && message.recommendedIds 
    ? message.recommendedIds.map(id => PRODUCT_MAP[id]).filter(p => p)
    : [];

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-6`}>
      <div className={`max-w-[85%] ${isBot ? 'ml-2' : 'mr-2'}`}>
        {/* Message Bubble */}
        <div className={`rounded-2xl p-4 shadow-sm ${
          isBot 
            ? 'bg-white border border-gray-200 rounded-tl-none' 
            : 'bg-green-500 text-white rounded-tr-none'
        }`}>
          <div className="flex items-start space-x-3">
            {isBot && (
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Zap className="w-4 h-4 text-green-600" />
              </div>
            )}
            <div className="flex-1">
              <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
              
              {/* Product Recommendations */}
              {isBot && recommendedProducts.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-sm font-semibold text-gray-700">
                    <ShoppingCart className="w-4 h-4 mr-2 text-green-500" />
                    Recommended Products
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {recommendedProducts.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onNavigate={onProductNavigate}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            {!isBot && (
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-2 ${isBot ? 'text-left ml-12' : 'text-right mr-12'}`}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

// --- Main Chatbot Component ---
const EcoBazaarXChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([{
      sender: 'bot',
      text: "👋 Welcome to EcoBazaarX! I'm your sustainable shopping assistant. I can help you find eco-friendly products, compare carbon footprints, and make conscious purchasing decisions. What brings you here today?",
      recommendedIds: [1, 3, 5],
      timestamp: new Date()
    }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { 
      sender: 'user', 
      text: userMessage, 
      timestamp: new Date() 
    }];
    
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage, newMessages);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        ...aiResponse,
        timestamp: new Date()
      }]);
      setLoading(false);
    }, 1000);
  };

  const handleQuickAction = (query) => {
    setInput(query);
  };

  const handleProductNavigate = (product) => {
    // In a real app, this would navigate to the product page
    alert(`🛍️ Navigating to ${product.name}\n\nPrice: $${product.price}\nRating: ${product.rating}/5 (${product.reviews} reviews)\nCarbon Footprint: ${product.carbon}\nDelivery: ${product.delivery}\n\n[Full product page with images, reviews, and checkout would load here]`);
  };

  const handleClearChat = () => {
    setMessages([{
      sender: 'bot',
      text: "👋 Welcome to EcoBazaarX! I'm your sustainable shopping assistant. I can help you find eco-friendly products, compare carbon footprints, and make conscious purchasing decisions. What brings you here today?",
      recommendedIds: [1, 3, 5],
      timestamp: new Date()
    }]);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="bg-green-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">EcoBazaarX Assistant</h3>
            <p className="text-green-100 text-sm">Online • Ready to help</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearChat}
            className="p-2 hover:bg-green-600 rounded-lg transition-colors"
            title="New Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-green-600 rounded-lg transition-colors"
            title="Minimize"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((message, index) => (
          <ChatBubble 
            key={index} 
            message={message} 
            onProductNavigate={handleProductNavigate}
          />
        ))}
        
        {loading && (
          <div className="flex justify-start mb-6">
            <div className="max-w-[85%] ml-2">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Finding sustainable options...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="px-4 pt-2">
          <QuickActions onAction={handleQuickAction} />
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about sustainable products..."
              className="w-full p-3 pl-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center ${
              !input.trim() || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        {/* Footer */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>EcoBazaarX © 2024</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3 h-3" />
            <span>Secure & Sustainable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoBazaarXChatbot;