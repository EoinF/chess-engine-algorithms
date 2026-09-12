import './Sidebar.css';

type SidebarProps = {
    evalScore: number;
};

export const Sidebar = ({evalScore}: SidebarProps) => {
    const evalRatio = Math.min(50 + 40 * (evalScore / 16), 99);
    return <div className="sidebar">
        <div className="eval">
            <div className="eval-bars">
                <div className="eval-white" style={{width: evalRatio + "%"}}/>
                <div className="eval-black" style={{width: (100 - evalRatio) + "%"}}/>
            </div>
            <div className="eval-score">
                {evalScore >= 0 && "+"}{evalScore}
            </div>
        </div>
    </div>
}