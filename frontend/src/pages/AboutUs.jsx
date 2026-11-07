import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ShieldCheck, Truck, Calendar, MapPin, CheckCircle, PackageCheck, Box, Clock, ArrowRight } from 'lucide-react';

const AboutUs = () => {
  // Interactive delivery date preview
  const [selectedOrderDayOffset, setSelectedOrderDayOffset] = useState(0);

  const getCalculatedDates = (offsetDays) => {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() + offsetDays);

    const packDate = new Date(orderDate);
    packDate.setDate(packDate.getDate() + 1);

    const dispatchDate = new Date(orderDate);
    dispatchDate.setDate(dispatchDate.getDate() + 2);

    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 4);

    return {
      orderFormatted: orderDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      packFormatted: packDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      dispatchFormatted: dispatchDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      deliveryFormatted: deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    };
  };

  const dates = getCalculatedDates(selectedOrderDayOffset);

  return (
    <div className="about-us-page">
      {/* Hero */}
      <section className="about-hero section-container">
        <span className="section-badge">Company & Philosophy</span>
        <h1 className="hero-title">
          Transparency in <span className="gradient-text">Hardware Origin</span> & <span className="gradient-text">Delivery Speed</span>
        </h1>
        <p className="hero-subtitle">
          We believe consumers deserve 100% clarity on where their products originate, how they are made, and the exact date they arrive at their door after ordering.
        </p>
      </section>

      {/* Sourcing & Provenance Detail Section */}
      <section id="provenance" className="section-container">
        <div className="section-header text-center">
          <span className="section-badge">Product Provenance</span>
          <h2 className="section-title">Where Do Our Products Come From?</h2>
          <p className="section-subtitle">
            Every device on our catalog is audited for ethical manufacturing, material purity, and factory certifications.
          </p>
        </div>

        <div className="provenance-cards-grid">
          <div className="provenance-country-card">
            <div className="country-flag-icon"><Globe size={28} /></div>
            <h3>Germany</h3>
            <span className="provenance-focus">Precision Mechanical & Ultrabook Alloys</span>
            <p>
              Our flagship ultrabooks are machined from solid billets of 100% recycled aluminum in Stuttgart, adhering to DIN standards and renewable energy manufacturing.
            </p>
          </div>

          <div className="provenance-country-card">
            <div className="country-flag-icon"><Globe size={28} /></div>
            <h3>Japan</h3>
            <span className="provenance-focus">Acoustic Drivers & Planar Magnetics</span>
            <p>
              Studio headphones diaphragms and drivers are hand-calibrated in Kyoto by master audio acousticians using organic lambskin ear-cups.
            </p>
          </div>

          <div className="provenance-country-card">
            <div className="country-flag-icon"><Globe size={28} /></div>
            <h3>Taiwan</h3>
            <span className="provenance-focus">Semiconductor & Keyboard Micro-Controllers</span>
            <p>
              High-frequency micro-controllers, custom PCB switches, and CNC keyboard bodies fabricated in the heart of Hsinchu Science Park.
            </p>
          </div>

          <div className="provenance-country-card">
            <div className="country-flag-icon"><Globe size={28} /></div>
            <h3>Switzerland</h3>
            <span className="provenance-focus">Medical-Grade Micro-Sensors</span>
            <p>
              Smart ring sensors and biometric hardware crafted in Neuchâtel, featuring grade-5 titanium and hypoallergenic ceramic interiors.
            </p>
          </div>
        </div>

        {/* Quality Audit Checklist */}
        <div className="audit-checklist-box">
          <div className="checklist-col">
            <div className="check-row">
              <ShieldCheck size={20} className="text-emerald" />
              <div>
                <strong>Zero Conflict Minerals</strong>
                <p>Tantalum, tin, tungsten, and gold are 100% certified from verified ethical mines.</p>
              </div>
            </div>
            <div className="check-row">
              <ShieldCheck size={20} className="text-emerald" />
              <div>
                <strong>Factory Audit Certification</strong>
                <p>All supplier factories must uphold ISO-9001 and ISO-14001 compliance standards.</p>
              </div>
            </div>
          </div>
          <div className="checklist-col">
            <div className="check-row">
              <ShieldCheck size={20} className="text-emerald" />
              <div>
                <strong>Third-Party Merchant Review</strong>
                <p>Partners wishing to sell on our platform must submit products for rigorous admin testing before publication.</p>
              </div>
            </div>
            <div className="check-row">
              <ShieldCheck size={20} className="text-emerald" />
              <div>
                <strong>Full Provenance Ledger</strong>
                <p>Each product page explicitly details the origin country and factory specs for the buyer.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Post-Purchase Order-to-Delivery Timeline */}
      <section id="delivery" className="section-container delivery-timeline-section">
        <div className="section-header text-center">
          <span className="section-badge">Post-Order Logistics</span>
          <h2 className="section-title">Delivery Dates After Customer Ordering</h2>
          <p className="section-subtitle">
            We provide exact dates and transparent stages from the instant an order is placed to arrival.
          </p>
        </div>

        {/* Interactive Order Date Picker */}
        <div className="interactive-delivery-tester">
          <div className="tester-header">
            <h4>Select Order Placement Date:</h4>
            <div className="date-selector-buttons">
              <button
                className={`date-pill ${selectedOrderDayOffset === 0 ? 'active' : ''}`}
                onClick={() => setSelectedOrderDayOffset(0)}
              >
                Order Today
              </button>
              <button
                className={`date-pill ${selectedOrderDayOffset === 1 ? 'active' : ''}`}
                onClick={() => setSelectedOrderDayOffset(1)}
              >
                Order Tomorrow
              </button>
              <button
                className={`date-pill ${selectedOrderDayOffset === 3 ? 'active' : ''}`}
                onClick={() => setSelectedOrderDayOffset(3)}
              >
                Order in 3 Days
              </button>
            </div>
          </div>

          {/* Timeline Display */}
          <div className="order-progress-stepper">
            <div className="step-point completed">
              <div className="point-icon"><Calendar size={20} /></div>
              <span className="step-title">1. Order Placed</span>
              <span className="step-date">{dates.orderFormatted}</span>
              <p className="step-desc">Payment confirmed, automated receipt sent, stock deducted</p>
            </div>

            <div className="step-connector" />

            <div className="step-point">
              <div className="point-icon"><Box size={20} /></div>
              <span className="step-title">2. Processing & QA</span>
              <span className="step-date">{dates.packFormatted}</span>
              <p className="step-desc">Item inspected, serial number logged, eco-packaged</p>
            </div>

            <div className="step-connector" />

            <div className="step-point">
              <div className="point-icon"><Truck size={20} /></div>
              <span className="step-title">3. Express Dispatch</span>
              <span className="step-date">{dates.dispatchFormatted}</span>
              <p className="step-desc">Handed to air courier, live tracking link activated</p>
            </div>

            <div className="step-connector" />

            <div className="step-point arrival">
              <div className="point-icon"><PackageCheck size={20} /></div>
              <span className="step-title">4. Doorstep Delivery</span>
              <span className="step-date delivery-highlight">{dates.deliveryFormatted}</span>
              <p className="step-desc">Signature delivery guaranteed at customer address</p>
            </div>
          </div>

          <div className="delivery-summary-banner">
            <Clock size={20} className="text-indigo" />
            <div>
              <strong>Standard Fulfillment SLA:</strong> Customers receive their goods within <strong>4 calendar days</strong> of placing an order.
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-container text-center about-cta">
        <h2>Experience the Jomnenh-KH Standard</h2>
        <p>Explore our transparent product catalog or build software with our engineering division.</p>
        <div className="hero-actions justify-center">
          <Link to="/products" className="btn-primary">Browse Products</Link>
          <Link to="/services" className="btn-secondary">Hire Software Team</Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
