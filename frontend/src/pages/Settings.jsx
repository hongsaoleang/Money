import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { User, Package, Calendar, MapPin, Phone, Mail, Shield, Clock, CheckCircle } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'profile'

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/orders/my');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="section-container text-center">
        <h2>Please Sign In</h2>
        <p>You need to be logged in to view your settings and orders.</p>
      </div>
    );
  }

  return (
    <div className="settings-page section-container">
      <div className="settings-header">
        <div className="user-profile-badge">
          <div className="profile-avatar">
            <img src="/JomnenhKH.jpg" alt={user.fullName} className="profile-avatar-img" />
          </div>
          <div>
            <h1>{user.fullName}</h1>
            <p className="profile-meta">{user.email} &bull; <span className="role-tag">{user.role}</span></p>
          </div>
        </div>
      </div>

      <div className="settings-tabs">
        <button
          className={`settings-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <Package size={16} /> Order History & Delivery Tracking ({orders.length})
        </button>
        <button
          className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={16} /> Profile & Shipping Addresses
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="orders-section">
          {loadingOrders ? (
            <div className="loading-spinner">Loading your order history...</div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <Package size={36} className="text-muted" />
              <h3>No orders placed yet</h3>
              <p>When you purchase products, your order status and post-purchase delivery date will appear here.</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-history-card">
                  <div className="order-header-row">
                    <div>
                      <span className="order-id">Order #{order.id}</span>
                      <span className="order-date">
                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="order-status-badge">
                      <span className={`badge badge-${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Delivery date after ordering */}
                  <div className="order-delivery-date-banner">
                    <Calendar size={18} className="text-indigo" />
                    <div>
                      <strong>Estimated Delivery Date:</strong>{' '}
                      {order.estimatedDeliveryDate
                        ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Calculated upon dispatch'}
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="order-items-table">
                    {order.items?.map((item) => (
                      <div key={item.id} className="order-item-row">
                        <img
                          src={item.product?.imageUrl || 'https://via.placeholder.com/60'}
                          alt={item.product?.name}
                          className="item-thumb"
                        />
                        <div className="item-info">
                          <h4>{item.product?.name}</h4>
                          <span className="item-origin">Origin: {item.product?.originCountry}</span>
                        </div>
                        <div className="item-qty">Qty: {item.quantity}</div>
                        <div className="item-price">
                          ${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer-row">
                    <div className="shipping-address-snippet">
                      <MapPin size={14} /> Shipping to: {order.shippingAddress || 'Primary registered address'}
                    </div>
                    <div className="order-total-amount">
                      Total: <span>${parseFloat(order.totalAmount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="profile-section">
          <div className="profile-card">
            <h3>Account Details</h3>
            <div className="profile-grid">
              <div className="info-block">
                <span className="info-lbl"><User size={14} /> Full Name</span>
                <span className="info-val">{user.fullName}</span>
              </div>
              <div className="info-block">
                <span className="info-lbl"><Mail size={14} /> Email Address</span>
                <span className="info-val">{user.email}</span>
              </div>
              <div className="info-block">
                <span className="info-lbl"><Shield size={14} /> Assigned Role</span>
                <span className="info-val">{user.role}</span>
              </div>
              <div className="info-block">
                <span className="info-lbl"><MapPin size={14} /> Default Delivery Address</span>
                <span className="info-val">{user.address || '742 Evergreen Terrace, Springfield, OR'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
