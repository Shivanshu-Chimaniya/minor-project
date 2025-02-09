import {Outlet} from "react-router-dom";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import "../App.css";

const Layout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const navigate = useNavigate();

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className="app">
			<nav className="header">
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}>
					{/* Logo */}
					<div style={{fontSize: "1.5rem", fontWeight: "bold"}}>
						InterviewPrep AI
					</div>

					{/* Menu Button */}
					<button
						onClick={toggleSidebar}
						style={{
							background: "none",
							border: "none",
							color: "white",
							cursor: "pointer",
							padding: "0.5rem",
						}}>
						☰ Menu
					</button>

					{/* Action Button */}
					<button
						className="cta-button"
						onClick={() => navigate("/interviews")}>
						Get Started
					</button>
				</div>
			</nav>

			{/* Sidebar */}
			{isSidebarOpen && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						height: "100%",
						width: "250px",
						backgroundColor: "#2c3e50",
						padding: "1rem",
						color: "white",
						zIndex: 1000,
					}}>
					<button
						onClick={toggleSidebar}
						style={{
							background: "none",
							border: "none",
							color: "white",
							cursor: "pointer",
							marginBottom: "1rem",
						}}>
						✕ Close
					</button>
					<ul style={{listStyle: "none"}}>
						<li style={{padding: "0.5rem 0"}}>Home</li>
						<li style={{padding: "0.5rem 0"}}>Interviews</li>
						<li style={{padding: "0.5rem 0"}}>Upload Resume</li>
						<li style={{padding: "0.5rem 0"}}>About</li>
					</ul>
				</div>
			)}

			{/* Main content */}
			<main className="main">
				<Outlet />
			</main>

			<footer className="footer">
				<p>© 2024 InterviewPrep AI. All rights reserved.</p>
			</footer>
		</div>
	);
};

export default Layout;
