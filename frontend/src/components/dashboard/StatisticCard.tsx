import React from "react";

interface StatisticCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
    title,
    value,
    icon,
    color,
}) => {
    return (
        <div className="col-xl-3 col-md-6 mb-4">
            <div
                className="card border-0 shadow-sm h-100"
                style={{ borderLeft: `5px solid ${color}` }}
            >
                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center">

                        <div>

                            <div
                                className="text-uppercase text-muted fw-semibold"
                                style={{ fontSize: "12px" }}
                            >
                                {title}
                            </div>

                            <h2 className="fw-bold mt-2">
                                {value}
                            </h2>

                        </div>

                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                width: 60,
                                height: 60,
                                backgroundColor: color,
                                color: "white",
                                fontSize: 24,
                            }}
                        >
                            {icon}
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default StatisticCard;