import type { ReactNode } from "react";

interface Props {

    title: string;

    children: ReactNode;

}

function SectionCard({ title, children }: Props) {

    return (

        <div className="card border-0 shadow-sm">

            <div className="card-header bg-white">

                <h5 className="mb-0">

                    {title}

                </h5>

            </div>

            <div className="card-body">

                {children}

            </div>

        </div>

    );

}

export default SectionCard;