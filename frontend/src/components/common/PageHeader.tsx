interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4">

            <div>

                <h2 className="fw-bold mb-1">
                    {title}
                </h2>

                {subtitle && (
                    <p className="text-muted mb-0">
                        {subtitle}
                    </p>
                )}

            </div>

        </div>
    );
}

export default PageHeader;