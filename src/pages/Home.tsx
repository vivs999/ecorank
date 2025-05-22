import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faUserFriends, faTrophy, faChartLine } from '@fortawesome/free-solid-svg-icons';

const Home: React.FC = () => {
  return (
    <>
      <div className="intro-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Make Eco-Friendly Choices Fun</h1>
              <p className="lead mb-4">
                Join EcoRank to compete in weekly challenges, form crews with friends,
                and track your impact on the environment through a gamified platform.
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                <Link to="/register" className="btn btn-eco btn-lg px-4 me-md-2">Get Started</Link>
                <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">Sign In</Link>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block text-center">
              <img 
                src="/images/eco-illustration.svg" 
                className="img-fluid" 
                alt="EcoRank illustration" 
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">How It Works</h2>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <FontAwesomeIcon icon={faUserFriends} className="fa-3x mb-3 text-primary" />
                  <h4>Create or Join a Crew</h4>
                  <p>Form teams with friends and compete together for eco-glory</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <FontAwesomeIcon icon={faLeaf} className="fa-3x mb-3 text-success" />
                  <h4>Complete Challenges</h4>
                  <p>Participate in weekly challenges focused on different eco-friendly actions</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <FontAwesomeIcon icon={faTrophy} className="fa-3x mb-3 text-warning" />
                  <h4>Climb the Leaderboard</h4>
                  <p>Earn points and see how you rank against others</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <FontAwesomeIcon icon={faChartLine} className="fa-3x mb-3 text-info" />
                  <h4>Track Your Impact</h4>
                  <p>See the real-world difference your actions make</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h2 className="mb-4">Weekly Challenges</h2>
            <div className="mb-4">
              <h5>Week 1: Carbon Footprint</h5>
              <p>Track your transportation and earn points for using eco-friendly options</p>
            </div>
            <div className="mb-4">
              <h5>Week 2: Recycling Challenge</h5>
              <p>Log your recyclable items and compete for the most recycled materials</p>
            </div>
            <div className="mb-4">
              <h5>Week 3: Food Carbon Footprint</h5>
              <p>Make environment-friendly food choices and track your impact</p>
            </div>
            <div className="mb-4">
              <h5>Week 4: Shower Timer Challenge</h5>
              <p>Save water by tracking your shower time and reducing waste</p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Ready to Make a Difference?</h3>
                <p className="card-text">
                  Join thousands of users already competing to become the most eco-friendly. Track your progress, 
                  challenge friends, and see your real-world environmental impact.
                </p>
                <div className="d-grid">
                  <Link to="/register" className="btn btn-eco btn-lg">Join EcoRank Today</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home; 