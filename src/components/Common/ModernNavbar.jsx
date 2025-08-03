import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/modern-navbar.css'; 
import defaultLogo from '/assets/images/MarksmasterLogo.png';
import altLogo from '/assets/images/Marksmasterlogodark.png';

/**
 * A modern, responsive, and self-contained navigation bar.
 * This component handles its own state and side effects, 
 * removing dependencies on external jQuery scripts.
 *
 * @returns {JSX.Element} The rendered ModernNavbar component.
 */
function ModernNavbar() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState({});
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const headerRef = useRef(null);

    // Effect to handle scroll-based header changes (replaces jQuery logic)
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Effect to close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setOpenDropdowns({});
    }, [location.pathname]);

    // Effect to add/remove class from body when mobile menu is open and prevent body scroll
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('mm-mobile-menu-open');
            document.body.style.overflow = 'hidden';
        } else {
            document.body.classList.remove('mm-mobile-menu-open');
            document.body.style.overflow = '';
        }
        
        // Cleanup on unmount
        return () => {
            document.body.classList.remove('mm-mobile-menu-open');
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    // Toggles the main mobile menu
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    // Toggles individual dropdowns in mobile view
    const handleDropdownToggle = (e, menuId) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenDropdowns(prev => ({ ...prev, [menuId]: !prev[menuId] }));
    };

    // Helper function to convert names to slugs
    const toSlug = (name) => name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        {
            to: "/subjects", label: "Subjects", id: "subjects",
            sublinks: [
                {
                    to: `/subjects/${toSlug("engineering")}`, label: "Engineering", id: "engineering",
                    sublinks: [
                        { to: `/subjects/${toSlug("engineering")}/${toSlug("mechanical engineering")}`, label: "Mechanical Engineering" },
                        { to: `/subjects/${toSlug("engineering")}/${toSlug("electrical engineering")}`, label: "Electrical Engineering" },
                        { to: `/subjects/${toSlug("engineering")}/${toSlug("electronics engineering")}`, label: "Electronics Engineering" },
                        { to: `/subjects/${toSlug("engineering")}/${toSlug("civil engineering")}`, label: "Civil Engineering" },
                    ]
                },
                {
                    to: `/subjects/${toSlug("computer science")}`, label: "Computer Science & IT", id: "cs",
                    sublinks: [
                        { to: `/subjects/${toSlug("computer science")}/${toSlug("coding")}`, label: "Coding" },
                        { to: `/subjects/${toSlug("computer science")}/${toSlug("machine learning")}`, label: "Machine Learning" },
                        { to: `/subjects/${toSlug("computer science")}/${toSlug("data analytics")}`, label: "Data Analytics & Stats" },
                        { to: `/subjects/${toSlug("computer science")}/${toSlug("erp tools")}`, label: "ERP tools" },
                        { to: `/subjects/${toSlug("computer science")}/${toSlug("development")}`, label: "Development" },
                        { to: `/subjects/${toSlug("computer science")}/${toSlug("cyber security")}`, label: "Cyber Security" },
                    ]
                },
                {
                    to: `/subjects/${toSlug("business")}`, label: "Business & Management", id: "business",
                    sublinks: [
                        { to: `/subjects/${toSlug("business")}/${toSlug("accounting")}`, label: "Accounting" },
                        { to: `/subjects/${toSlug("business")}/${toSlug("finance")}`, label: "Finance" },
                        { to: `/subjects/${toSlug("business")}/${toSlug("marketing")}`, label: "Marketing" },
                        { to: `/subjects/${toSlug("business")}/${toSlug("management")}`, label: "Management" },
                        { to: `/subjects/${toSlug("business")}/${toSlug("economics")}`, label: "Economics" },
                        { to: `/subjects/${toSlug("business")}/${toSlug("strategy")}`, label: "Strategy" },
                    ]
                },
                { to: `/subjects/${toSlug("medical")}`, label: "Medical & Biology" },
                { to: `/subjects/${toSlug("humanities")}`, label: "Social Sciences & Humanities" },
            ]
        },
        { to: "/testimonials", label: "Testimonial" },
        { to: "/contact", label: "Contact" },
    ];

    // Recursive function to render navigation links and dropdowns
    const renderNavLinks = (links) => {
        return links.map(link => (
            <li key={link.id || link.to} className={`mm-nav-item ${link.sublinks ? 'mm-dropdown' : ''}`}>
                <Link to={link.to} className="mm-nav-link">
                    {link.label}
                    {link.sublinks && (
                        <button 
                            className="mm-dropdown-toggle" 
                            onClick={(e) => handleDropdownToggle(e, link.id)}
                            aria-expanded={!!openDropdowns[link.id]}
                            aria-label={`Toggle ${link.label} submenu`}
                        >
                            <i className={`fas fa-chevron-down ${openDropdowns[link.id] ? 'open' : ''}`}></i>
                        </button>
                    )}
                </Link>
                {link.sublinks && (
                    <ul className={`mm-dropdown-menu ${openDropdowns[link.id] ? 'show' : ''}`}>
                        {renderNavLinks(link.sublinks)}
                    </ul>
                )}
            </li>
        ));
    };

    return (
        <header ref={headerRef} className={`mm-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="mm-container">
                <div className="mm-logo">
                    <Link to="/">
                        <img src={isScrolled ? altLogo : defaultLogo} alt="MarksMaster Logo" className="mm-logo-img" />
                    </Link>
                </div>

                <nav className={`mm-nav-container ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div className="mm-nav-overlay" onClick={() => setMobileMenuOpen(false)}></div>
                    <ul className="mm-nav-list">
                        {renderNavLinks(navLinks)}
                    </ul>
                </nav>

                <div className="mm-header-actions">
                    <a href="tel:+911234567890" className="mm-contact-link">
                        <i className="fas fa-phone-alt"></i>
                        <span className="mm-contact-text">+91 12345 67890</span>
                    </a>
                    <button 
                        className={`mm-mobile-toggle ${isMobileMenuOpen ? 'open' : ''}`}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle navigation"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className="mm-hamburger-line"></span>
                        <span className="mm-hamburger-line"></span>
                        <span className="mm-hamburger-line"></span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default ModernNavbar;



// src/components/Common/Navbar.jsx
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import "./css/common.css"
// import defaultLogo from '/assets/images/MarksmasterLogo.png';
// import altLogo from '/assets/images/Marksmasterlogodark.png';
// import mobileLogo from '/assets/images/MarksmasterLogo.png';


// function Navbar() {

//   const navigate = useNavigate(); // Get navigate function

//   const toSlug = (name) => name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');


//   return (
// <header>
//             {/* The 'data-header-hover="light"' attribute enables the color change on scroll via main.js */}
//             <nav className="navbar navbar-expand-lg header-transparent bg-transparent header-reverse" data-header-hover="light">
//                 <div className="container-fluid">
//                     <div className="col-auto col-lg-2 me-lg-0 me-auto">
//                         <Link className="navbar-brand" to="/">
//                             {/* The 'default-logo' is shown initially, and 'alt-logo' is shown on scroll */}
//                             <img src={defaultLogo} data-at2x={defaultLogo} alt="MarksMaster" className="default-logo" />
//                             <img src={altLogo} data-at2x={altLogo} alt="MarksMaster Dark" className="alt-logo" />
//                             <img src={mobileLogo} data-at2x={mobileLogo} alt="MarksMaster Mobile" className="mobile-logo" />
//                         </Link>
//                     </div>
//                     <div className="col-auto menu-order position-static">
//                         {/* This button toggles the menu on mobile */}
//                         <button className="navbar-toggler float-start" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-label="Toggle navigation">
//                             <span className="navbar-toggler-line"></span>
//                             <span className="navbar-toggler-line"></span>
//                             <span className="navbar-toggler-line"></span>
//                             <span className="navbar-toggler-line"></span>
//                         </button>
//                         <div className="collapse navbar-collapse" id="navbarNav">
//                             <ul className="navbar-nav alt-font">
//                                 <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
//                                 <li className="nav-item"><Link to="/about" className="nav-link">About</Link></li>
//                                 <li className="nav-item dropdown simple-dropdown dropdown-with-icon">
//                                     {/* Link to a general subjects page. The data-bs-toggle is removed to prevent conflicts. */}
//                                     <Link to="/subjects" className="nav-link dropdown-toggle">Subjects</Link>
//                                     <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink3">
//                                         {/* Engineering Submenu */}
//                                         <li className="dropdown" role="button" aria-expanded="false">
//                                             <Link to={`/subjects/${toSlug("engineering")}`} className="dropdown-item center-align-vertical">
//                                                 <i className="bi bi-laptop"></i>
//                                                 <div className="submenu-icon-content">
//                                                     <span>Engineering</span>
//                                                 </div>
//                                             </Link>
//                                             <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink3">
//                                                 <li><Link to={`/subjects/${toSlug("engineering")}/${toSlug("mechanical engineering")}`}>Mechanical Engineering</Link></li>
//                                                 <li><Link to={`/subjects/${toSlug("engineering")}/${toSlug("electrical engineering")}`}>Electrical Engineering</Link></li>
//                                                 <li><Link to={`/subjects/${toSlug("engineering")}/${toSlug("electronics engineering")}`}>Electronics Engineering</Link></li>
//                                                 <li><Link to={`/subjects/${toSlug("engineering")}/${toSlug("civil engineering")}`}>Civil Engineering</Link></li>
//                                             </ul>
//                                         </li>
//                                         {/* Computer Science Submenu */}
//                                         <li className="dropdown" role="button" aria-expanded="false">
//                                             <Link to={`/subjects/${toSlug("computer science")}`} className="dropdown-item">
//                                                 <i className="bi bi-laptop"></i>
//                                                 <div className="submenu-icon-content">
//                                                     <span>Computer Science &<br />IT</span>
//                                                 </div>
//                                             </Link>
//                                             <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink3">
//                                                 <li><Link to={`/subjects/${toSlug("computer science")}/${toSlug("coding")}`}>Coding</Link></li>
//                                                 <li><Link to={`/subjects/${toSlug("computer science")}/${toSlug("machine learning")}`}>Machine Learning</Link></li>
//                                                 <li><Link to={`/subjects/${toSlug("computer science")}/${toSlug("data analytics")}`}>Data Analytics & Stats</Link></li>
//                                                 <li><Link to={`/subjects/${toSlug("computer science")}/${toSlug("erp tools")}`}>ERP tools</Link></li>
//                                                 <li><Link to={`/subjects/${toSlug("computer science")}/${toSlug("development")}`}>Development</Link></li>
//                                                 <li><Link to={`/subjects/${toSlug("computer science")}/${toSlug("cyber security")}`}>Cyber Security</Link></li>
//                                             </ul>
//                                         </li>
//                                         {/* Business Submenu */}
//                                         <li className="dropdown" role="button" aria-expanded="false">
//                                             <Link to={`/subjects/${toSlug("business")}`} className="dropdown-item">
//                                                 <i className="bi bi-laptop"></i>
//                                                 <div className="submenu-icon-content">
//                                                     <span>Business &<br />Management</span>
//                                                 </div>
//                                             </Link>
//                                             <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink3">
//                                                 <li><Link to={`/subjects/${toSlug("business")}/${toSlug("accounting")}`}>Accounting</Link></li>
//                                                 <li><Link to={`/subjects/${toSlug("business")}/${toSlug("finance")}`}>Finance</Link></li>
//                                                 <li><Link to={`/subjects/${toSlug("business")}/${toSlug("marketing")}`}>Marketing</Link></li>
//                                                 <li><Link to={`/subjects/${toSlug("business")}/${toSlug("management")}`}>Management</Link></li>
//                                                 <li><Link to={`/subjects/${toSlug("business")}/${toSlug("economics")}`}>Economics</Link></li>
//                                                 <li><Link to={`/subjects/${toSlug("business")}/${toSlug("strategy")}`}>Strategy</Link></li>
//                                             </ul>
//                                         </li>
//                                         {/* Other Submenus */}
//                                         <li className="dropdown" role="button" aria-expanded="false">
//                                             <Link to={`/subjects/${toSlug("medical")}`} className="dropdown-item">
//                                                 <i className="bi bi-laptop"></i>
//                                                 <div className="submenu-icon-content">
//                                                     <span>Medical & Biology</span>
//                                                 </div>
//                                             </Link>
//                                         </li>
//                                         <li className="dropdown" role="button" aria-expanded="false">
//                                             <Link to={`/subjects/${toSlug("humanities")}`} className="dropdown-item">
//                                                 <i className="bi bi-laptop"></i>
//                                                 <div className="submenu-icon-content">
//                                                     <span>Social Sciences<br />& Humanities</span>
//                                                 </div>
//                                             </Link>
//                                         </li>
//                                     </ul>
//                                 </li>
//                                 <li className="nav-item"><Link to="/testimonials" className="nav-link">Testimonial</Link></li>
//                                 <li className="nav-item"><Link to="/contact" className="nav-link">Contact</Link></li>
//                             </ul>
//                         </div>
//                     </div>
//                     <div className="col-auto col-lg-2 text-end d-none d-sm-flex">
//                         <div className="header-icon">
//                             <div>
//                                 <div className="alt-font fw-500 lg-fs-15">
//                                     <a href="tel:1800222000" className="widget-text text-white-hover">
//                                         <i className="feather icon-feather-phone-call me-10px lg-me-5px"></i>+91 XXXXX XXXXX
//                                     </a>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </nav>
//         </header>
//   );
// }

// export default Navbar;