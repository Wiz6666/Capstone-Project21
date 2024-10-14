"use strict";

var _react = _interopRequireDefault(require("react"));
var _react2 = require("@testing-library/react");
var _reactRouterDom = require("react-router-dom");
var _HomePage = _interopRequireDefault(require("../pages/HomePage"));
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
require("@testing-library/jest-dom");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// To enable navigation for testing

// Mock video file path
jest.mock('../public/24 uwa capstone Group20 webpage background video.mp4', () => 'mockedVideoUrl.mp4');
describe('HomePage Component', () => {
  test('renders the main title', () => {
    (0, _react2.render)(/*#__PURE__*/_react.default.createElement(_reactRouterDom.MemoryRouter, null, /*#__PURE__*/_react.default.createElement(_HomePage.default, null)));
    const titleElement = _react2.screen.getByText(/PROJECT MANAGEMENT SYSTEM/i);
    expect(titleElement).toBeInTheDocument();
  });
  test('renders Sign in and Sign up buttons', () => {
    (0, _react2.render)(/*#__PURE__*/_react.default.createElement(_reactRouterDom.MemoryRouter, null, /*#__PURE__*/_react.default.createElement(_HomePage.default, null)));
    const signInButton = _react2.screen.getByText(/Sign in/i);
    const signUpButton = _react2.screen.getByText(/Sign up/i);
    expect(signInButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });
  test('renders What is AASYP PMS? section', () => {
    (0, _react2.render)(/*#__PURE__*/_react.default.createElement(_reactRouterDom.MemoryRouter, null, /*#__PURE__*/_react.default.createElement(_HomePage.default, null)));
    const infoTitle = _react2.screen.getByText(/WHAT IS AASYP PMS\?/i);
    const description = _react2.screen.getByText(/Our mission is to empower teams/i);
    expect(infoTitle).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });
  test('renders Contact Us section with contact details', () => {
    (0, _react2.render)(/*#__PURE__*/_react.default.createElement(_reactRouterDom.MemoryRouter, null, /*#__PURE__*/_react.default.createElement(_HomePage.default, null)));
    const contactTitle = _react2.screen.getByText(/CONTACT US/i);
    const phone = _react2.screen.getByText(/\(123\) 456-7890/);
    const email = _react2.screen.getByText(/team@aasyp.org/i);
    expect(contactTitle).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
    expect(email).toBeInTheDocument();
  });
  test('renders social media icons with links', () => {
    (0, _react2.render)(/*#__PURE__*/_react.default.createElement(_reactRouterDom.MemoryRouter, null, /*#__PURE__*/_react.default.createElement(_HomePage.default, null)));
    const twitterIcon = _react2.screen.getByAltText(/Twitter/i);
    const facebookIcon = _react2.screen.getByAltText(/Facebook/i);
    const instagramIcon = _react2.screen.getByAltText(/Instagram/i);
    const linkedinIcon = _react2.screen.getByAltText(/LinkedIn/i);
    expect(twitterIcon).toBeInTheDocument();
    expect(facebookIcon).toBeInTheDocument();
    expect(instagramIcon).toBeInTheDocument();
    expect(linkedinIcon).toBeInTheDocument();
  });
});
