// import "./Navbar.css";

function Navbar() {

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">

            <div className="container-fluid">

                <span className="navbar-brand fw-bold">

                    Ecommerce Management

                </span>

                <div className="d-flex align-items-center">

                    <span className="text-white me-3">

                        Welcome Admin

                    </span>

                    <img
                        src="https://ui-avatars.com/api/?name=Admin"
                        width="38"
                        height="38"
                        className="rounded-circle"
                    />

                </div>

            </div>

        </nav>

    );

}

export default Navbar;