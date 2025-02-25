import React from 'react';
import './Homepage.css';

const Homepage = () => {
    return (
        <div className="homepage">
            <section className="hero">
                <h1>Welcome to TheMathGuy</h1>
                <p>Your personal guide to understanding mathematics</p>
            </section>

            <section className="features">
                <h2>What We Offer</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <h3>Learn by Level</h3>
                        <p>From elementary to advanced mathematics, find content suited to your level</p>
                    </div>
                    <div className="feature-card">
                        <h3>Explore Fields</h3>
                        <p>Discover different mathematical fields from algebra to calculus</p>
                    </div>
                    <div className="feature-card">
                        <h3>Interactive Tools</h3>
                        <p>Use our calculators and interactive demonstrations to enhance learning</p>
                    </div>
                    <div className="feature-card">
                        <h3>Visual Learning</h3>
                        <p>Watch animated demonstrations of mathematical concepts</p>
                    </div>
                </div>
            </section>

            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <p>Choose your math level or field</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <p>Search for a specific concept</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <p>Access lessons, calculators, and demonstrations</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Homepage; 