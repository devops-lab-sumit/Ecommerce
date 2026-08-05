import { Link } from "react-router-dom";

import { ROUTES } from "../../constants/routes";

import SectionCard from "../common/SectionCard";

function QuickActions() {

    return (

        <SectionCard title="Quick Actions">

            <div className="d-grid gap-2">

                <Link
                    to={ROUTES.PLACE_ORDER}
                    className="btn btn-primary">

                    Place Order

                </Link>

                <Link
                    to={ROUTES.CUSTOMERS}
                    className="btn btn-outline-primary">

                    Manage Customers

                </Link>

                <Link
                    to={ROUTES.PRODUCTS}
                    className="btn btn-outline-primary">

                    Manage Products

                </Link>

            </div>

        </SectionCard>

    );

}

export default QuickActions;