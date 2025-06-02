import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PackageCheck, PackageSearch, ShoppingCart } from "lucide-react";
import axios from "axios";
import UserContext from '../admin/UserContext';
import { useNavigate } from "react-router-dom";

function CustomerDashboard() {
  const { cUSer } = useContext(UserContext);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (cUSer?._id) {
      fetchUserData();
    }
  }, [cUSer]);

  const fetchUserData = async () => {
    const userResponse = await axios.get(`http://localhost:3001/users/${cUSer._id}`);
    const updatedUser = userResponse.data;
    try {
      setLoading(true);
      const ordersResponse = await axios.get(`http://localhost:3001/orders?userId=${cUSer._id}&sort=-createdAt&populate=product`);
      const orders = ordersResponse.data;
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(order => order.status === 'Pending').length;
      const totalSpent = orders
        .filter(order => order.status === "Confirmed")
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      setOrderHistory(orders);
      setStats({
        totalOrders,
        pendingOrders,
        totalSpent: parseFloat(totalSpent.toFixed(2))
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!cUSer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 flex items-center justify-center">
        <p>Unable to load user data. Please try again later.</p>
      </div>
    );
  }

  const fullName = cUSer.name || `${cUSer.firstName || ''} ${cUSer.lastName || ''}`.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {cUSer.firstName || cUSer.name?.split(' ')[0] || 'User'}!</h1>
          <p className="text-gray-400">Here's what's happening with your account</p>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border-2 border-primary hover:border-primary/80 transition-colors">
            <AvatarImage src={cUSer.avatar} />
            <AvatarFallback>{fullName[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-gray-500">All your orders</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pending Orders</CardTitle>
            <PackageSearch className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-gray-500">Currently processing</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Spent</CardTitle>
            <PackageCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSpent}</div>
            <p className="text-xs text-gray-500">All-time purchases</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 hover:border-primary/80 transition-colors">
                <AvatarImage src={cUSer.avatar} />
                <AvatarFallback>{fullName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{fullName}</h3>
                <p className="text-sm text-gray-400">{cUSer.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-gray-400">UserName</p>
                <p>{cUSer.name || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400">Phone</p>
                <p>{cUSer.phone || cUSer.mobilePhone || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400">Address</p>
                <p>
                  {[cUSer.address, cUSer.city, cUSer.country]
                    .filter(Boolean)
                    .join(', ') || 'Not provided'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderHistory.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <div>
                    <p className="font-medium">
                      {order.product?.name || 'Unknown Product'} • #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt || order.dateOrdered).toLocaleDateString()} • 
                      {order.quantity} item{order.quantity !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.totalPrice?.toFixed(2) || '0.00'}</p>
                    <Badge 
                      variant={
                        order.status === "Delivered" || order.status === "Confirmed" ? "success" :
                        order.status === "Shipped" ? "secondary" :
                        "destructive"
                      }
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {orderHistory.length === 0 && (
                <p className="text-gray-400 text-center py-4">No orders found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CustomerDashboard;