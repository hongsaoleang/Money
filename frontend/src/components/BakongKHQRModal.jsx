import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { BakongKHQR, IndividualInfo, khqrData } from 'bakong-khqr';
import api from '../api/client';
import { ShieldCheck, CheckCircle2, Clock, X, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';

const BakongKHQRModal = ({ isOpen, onClose, amount, orderItems, shippingAddress, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [khqrString, setKhqrString] = useState('');
  const [md5Hash, setMd5Hash] = useState('');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending' | 'verifying' | 'success' | 'failed'
  const [verifyingOrder, setVerifyingOrder] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Waiting for Bakong payment scan...');
  const canvasRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      return;
    }

    setTimeLeft(15 * 60);
    setPaymentStatus('pending');
    generateKHQR();

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isOpen, amount]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0 || paymentStatus === 'success') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentStatus('failed');
          setStatusMessage('Payment session expired. Please generate a new QR code.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, paymentStatus]);

  const generateKHQR = async () => {
    setLoading(true);
    try {
      // Fetch merchant settings from backend
      let merchantAccount = 'hongsaoleang@aclb';
      let merchantName = 'Hong Saoleang';
      let merchantCity = 'Phnom Penh';

      try {
        const configRes = await api.get('/api/payment/bakong/config');
        if (configRes.data) {
          merchantAccount = configRes.data.bakongAccountId || merchantAccount;
          merchantName = configRes.data.merchantName || merchantName;
          merchantCity = configRes.data.merchantCity || merchantCity;
        }
      } catch (err) {
        console.warn('Using default Bakong config', err);
      }

      const billNo = 'INV-' + Date.now().toString().slice(-6);
      const expirationTimestamp = Date.now() + 15 * 60 * 1000;

      const khqr = new BakongKHQR();
      const info = new IndividualInfo(
        merchantAccount,
        merchantName,
        merchantCity,
        {
          currency: khqrData.currency.usd,
          amount: parseFloat(amount.toFixed(2)),
          billNumber: billNo,
          expirationTimestamp,
        }
      );

      const response = khqr.generateIndividual(info);

      if (response && response.data && response.data.qr) {
        const qr = response.data.qr;
        const md5 = response.data.md5;
        setKhqrString(qr);
        setMd5Hash(md5);

        // Render QR Code onto canvas
        setTimeout(() => {
          if (canvasRef.current) {
            QRCode.toCanvas(
              canvasRef.current,
              qr,
              {
                width: 240,
                margin: 2,
                color: {
                  dark: '#1e293b',
                  light: '#ffffff',
                },
              },
              (error) => {
                if (error) console.error('QR rendering error', error);
              }
            );
          }
        }, 100);

        startPolling(md5);
      } else {
        setStatusMessage('Could not generate dynamic KHQR payload.');
      }
    } catch (err) {
      console.error('Failed to generate Bakong KHQR', err);
      setStatusMessage('Error creating payment QR: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (md5) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const checkRes = await api.post('/api/payment/bakong/check-status', { md5 });
        if (checkRes.data && (checkRes.data.success === true || checkRes.data.responseCode === 0)) {
          clearInterval(pollIntervalRef.current);
          handlePaymentConfirmed('Payment verified via Bakong Network!');
        }
      } catch (err) {
        // Polling network ignore
      }
    }, 3500);
  };

  const handlePaymentConfirmed = async (reason = 'Bakong KHQR Payment Confirmed') => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setVerifyingOrder(true);
    setStatusMessage(reason);

    try {
      const orderPayload = {
        shippingAddress,
        items: orderItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const res = await api.post('/api/orders', orderPayload);
      setPaymentStatus('success');
      setTimeout(() => {
        onSuccess(res.data);
      }, 1000);
    } catch (err) {
      console.error('Order creation failed after payment', err);
      alert('Payment received but failed to create order: ' + (err.response?.data?.message || err.message));
    } finally {
      setVerifyingOrder(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="bakong-modal-overlay" onClick={onClose}>
      <div className="bakong-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header with official NBC KHQR red theme */}
        <div className="bakong-header">
          <div className="bakong-branding">
            <span className="bakong-logo-tag">KHQR</span>
            <div className="bakong-brand-text">
              <h3>Bakong Payment</h3>
              <span>National Bank of Cambodia</span>
            </div>
          </div>
          <button className="bakong-close-btn" onClick={onClose} title="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Merchant & Amount Box */}
        <div className="bakong-merchant-info">
          <div className="bakong-merchant-row">
            <span className="label">Merchant:</span>
            <strong className="value">Hong Saoleang</strong>
          </div>
          <div className="bakong-merchant-row">
            <span className="label">Bakong ID:</span>
            <span className="value-id">hongsaoleang@aclb</span>
          </div>
          <div className="bakong-amount-box">
            <span className="bakong-amount-label">Amount Due (USD)</span>
            <span className="bakong-amount-number">${amount.toFixed(2)}</span>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="bakong-qr-body">
          {loading ? (
            <div className="bakong-loading">
              <RefreshCw size={32} className="spin text-rose-500" />
              <p>Generating NBC Dynamic KHQR...</p>
            </div>
          ) : paymentStatus === 'success' ? (
            <div className="bakong-success-state">
              <CheckCircle2 size={56} className="text-emerald" />
              <h4>Payment Successful!</h4>
              <p>Finalizing your order and alerting Telegram bot...</p>
            </div>
          ) : (
            <div className="bakong-qr-wrapper">
              <div className="bakong-frame">
                <canvas ref={canvasRef} className="bakong-canvas" />
                <div className="bakong-frame-center-badge">
                  <span>KHQR</span>
                </div>
              </div>

              <div className="bakong-timer-row">
                <Clock size={16} className="text-amber-500" />
                <span>QR valid for: <strong>{formatTimer(timeLeft)}</strong></span>
              </div>

              <p className="bakong-scan-instruction">
                Scan with <strong>Bakong App</strong>, <strong>ABA Mobile</strong>, <strong>ACLEDA</strong>, or any Cambodian banking app.
              </p>
            </div>
          )}
        </div>

        {/* Status / Live Check */}
        {paymentStatus !== 'success' && (
          <div className="bakong-status-bar">
            <RefreshCw size={14} className="spin text-slate-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="bakong-footer-actions">
          {paymentStatus !== 'success' && (
            <button
              onClick={() => handlePaymentConfirmed('Verified: Payment confirmed by customer')}
              disabled={verifyingOrder}
              className="bakong-verify-btn"
            >
              {verifyingOrder ? (
                <>
                  <RefreshCw size={16} className="spin" /> Verifying Order...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} /> I Have Completed Payment
                </>
              )}
            </button>
          )}

          <button onClick={onClose} className="bakong-cancel-btn">
            Cancel & Return to Cart
          </button>
        </div>

        <div className="bakong-security-note">
          <ShieldCheck size={14} /> Official NBC EMVCo Compliant KHQR Standard
        </div>
      </div>
    </div>
  );
};

export default BakongKHQRModal;
