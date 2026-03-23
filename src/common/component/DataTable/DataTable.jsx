import './DataTable.css'

export default function DataTable({ columns = [], data = [] }) {
    return (
        <div className="smartbiz-table-wrapper">
            <table className="smartbiz-table">
                <thead>
                    <tr>
                        {columns.map((col, i) => (
                            <th 
                                key={i} 
                                className={`smartbiz-table__head-cell ${col.align ? `smartbiz-table__head-cell--${col.align}` : ''}`}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="smartbiz-table__row">
                                {columns.map((col, colIndex) => (
                                    <td 
                                        key={colIndex} 
                                        className={`smartbiz-table__cell ${col.align ? `smartbiz-table__cell--${col.align}` : ''}`}
                                    >
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="smartbiz-table__empty">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
