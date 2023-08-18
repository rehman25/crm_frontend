import React, { useState, useEffect, useRef } from 'react'
import OrderDataTable from 'react-data-table-component'
import '../components/assets/css/ordersTable.css'
import SearchBar from './SearchBar';
import useClipboard from "react-use-clipboard";
import stripe_logo from '../assets/images/stripelogo.webp'
import paypal_logo from '../assets/images/paypal.webp'
import upwork_logo from '../assets/images/upworklogo.webp'
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import { RxCrossCircled as Close_ico } from "react-icons/rx";
import { AiOutlineDownload as Download_ico } from "react-icons/ai";
import { AiOutlineFileText as File_ico } from "react-icons/ai";
import { FiCopy as Copy_ico } from "react-icons/fi";
import { RiFileExcel2Fill as Excel_ico } from "react-icons/ri";
import { FiPrinter as Print_ico } from "react-icons/fi";
import word_ico from '../assets/images/icons/wordIco.webp'
import excel_ico from '../assets/images/icons/excel_ico.webp'
import { FcImageFile as Picture_ico } from "react-icons/fc";
import userImg from '../assets/images/icons/userIco.png'
import { GrFormView as View_ico } from "react-icons/gr";
import { Tooltip } from "react-tooltip";
import {useReactToPrint } from 'react-to-print';

import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'

const config = require('../components/config.json')

function AllOrdersCom() {

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle:"All Orders",
      pageStyle:"print",
    });

    const handlehideShow=()=>{
        document.getElementById('hidediv').style.display='block'
        setTimeout(() => {
            document.getElementById('hidediv').style.display='none'
        }, 1);
    }

    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    const navigate = useNavigate()
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isGetAllProgress, setGetAllProgress] = useState([]);
    const [isOrdersData, setOrdersData] = useState([]);
    const [isFilterOrder, setFilterOrder] = useState([])
    const [isFilterValue, setFilterValue] = useState("");
    const [error, setError,] = useState();
    const [isCopied, setCopied] = useClipboard(JSON.stringify(isOrdersData));
    const [isFiles, setFiles] = useState([])
    const [isFiledialogueBox, setFiledialogueBox] = useState(false);
    const [isFiledialogueBox1, setFiledialogueBox1] = useState(false);
    const [fileDataLoader, setFileDataLoader] = useState(false);
    const [fileLoading, setFileLoading] = useState(true);
    const [ids, setids] = useState("")
    const [complete, setcomplete] = useState('')
    const [page, setPage] = useState(0)
    const [Isrows, setRows] = useState([]);


   
    async function getOrders() {
        await fetch(`${config['baseUrl']}/orders/GetOrders/${parseInt(page)}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/orders/GetOrders/${parseInt(page)}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setOrdersData(response.data)
                    setFilterOrder(response.data)
                    setRows(response.totalRows)
                    setDataLoader(true)
                }).catch((errs) => {
                    showAlert(errs.message, "warning")
                }).finally(() => { setLoading(false) })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setOrdersData(response.data)
                setFilterOrder(response.data)
                setRows(response.totalRows)
                setDataLoader(true)
            }
        }).catch((errs) => {
            showAlert(errs.message, "warning")
        }).finally(() => { setLoading(false) })
    }
    async function getAllProgress() {
        await fetch(`${config['baseUrl']}/orders/GetAllProgress`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/orders/GetAllProgress`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setGetAllProgress(response.data)
                }).catch((errs) => {
                    showAlert(errs.message, "warning")
                })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setGetAllProgress(response.data)
            }
        }).catch((errs) => {
            showAlert(errs.message, "warning")
        })
    }
    const showAlert = (message, type) => {
        setError({
            message: message,
            type: type,
        })
    }
    const customStyles = {
        headCells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                borderTop: "1px solid #80808021",
                borderLeft: "1px solid #80808021",
                borderRight: "1px solid #80808021",
            },
        },
        cells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                borderBottom: "1px solid #80808021",
                borderLeft: "1px solid #80808021",
                borderRight: "1px solid #80808021",
            },
        },
    };
    const columns = [
        {
            name: "R.No",
            cell: (row, index) => index + 1,
            grow:0,
            minWidth: "50px",
        },
        {
            name: "Customer Details",
            grow: 0,
            minWidth: "400px",
            left: true,
            selector: (row) => 
            <div className='dataTableBox'>
                <div className='dataTableFlexBox'>
                    <h5>
                        <img src={userImg}/>
                    </h5>
                    <h6>
                        <span data-tooltip-id='row-name' data-tooltip-content={`Name :`+ " " +row.name} className='tableName'>  
                            {row.name}
                        </span>
                        <span data-tooltip-id='row-email' data-tooltip-content={`Email :`+ " " +row.email} className='tableEmail'>
                            {row.email}
                        </span>
                    </h6>
                </div>
                <Tooltip
                    id="row-name"
                    place="bottom"
                />
                <Tooltip
                    id="row-email"
                    place="bottom"
                />
                <Tooltip
                    id="row-number"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Phone",
            grow: 0,
            left: true,
            selector: (row) => 
            <div className='dataTableBox'>
                 <span style={{fontSize: "11px"}}
                    data-tooltip-id='row-number' 
                    data-tooltip-content={`Number :`+ " " +row.number}>{row.number}
                </span>
                
                <Tooltip
                    id="row-number"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Package Details",
            selector: (row) => 
            <div className='pacDetailsBox'>
                    <>
                        {
                            row.package_name ?
                            <span className="mt-2 package_name" data-tooltip-id='package_name' data-tooltip-content={`Package name :`+ " " +row.package_name}>
                                {row.package_name}
                            </span> :
                            <span className="notFoundMsg">Not Found</span>
                        }
                        {
                            row.amount ?
                            <span data-tooltip-id='amount' className='mb-2 mt-2 package_name' data-tooltip-content={`Amount:`+ " " +`$${row.amount}`}>
                                {`$${row.amount}`}</span> :
                            <span className="notFoundMsg">Not Found</span>
                        }
                    </>
                    <Tooltip
                        id="package_name"
                        place="bottom"
                    />
                    <Tooltip
                        id="amount"
                        place="bottom"
                    />
            </div>
        },
        {
            name: "Payment",
            grow: 0,
            minWidth: "75px",
            selector: (row) =>
                <div className='dataTableBox'>
                    {row.payment_method == "stripe" ?
                        <img src={stripe_logo} alt="" />
                        : row.payment_method == "paypal" ?
                            <img src={paypal_logo} alt="" />
                            : row.payment_method == "upwork" ?
                                <img src={upwork_logo} alt="" />
                                : row.payment_method == "Stripe" ?
                                    <img src={stripe_logo} alt="" />
                                    : row.payment_method == "Paypal" ?
                                        <img src={paypal_logo} alt="" />
                                        : row.payment_method == "Upwork" ?
                                            <img src={upwork_logo} alt="" />
                                            : <span className="notFoundMsg">Not Found</span>
                    }
                </div>
        },
        {
            name: "Invoice",
            grow: 0,
            minWidth: "62px",
            selector: (row) =>
            <div className='dataTableIconBox'>
                {row.invoice ?
                    <a href={`https://payments-api.logomish.com${row.invoice!==null&&row.invoice!==undefined&&row.invoice!==""?row.invoice.split('/uploads')[1]:""}`} target='_blank'>
                       <View_ico/>
                    </a>
                    :
                    <span className="notFoundMsg">Not Found</span>}
                    <Tooltip
                        anchorSelect=".row-invoice"
                        place="bottom"
                        content="View Invoice"
                    />
            </div>
        },
        {
            name: "Files",
            grow:0,
            minWidth: "60px",
            selector: (row) =>
                <div className='dataTableIconBox'>
                    <button className='viewFileBox' onClick={() => {
                        filesHandler()
                        setids(row.id)
                    }}><File_ico className='fileViewIcon'/></button>
                     <Tooltip
                        anchorSelect=".viewFileBox"
                        place="bottom"
                        content="View file Box"
                    />
                </div>

        },
        {
            name: "Links",
            grow:0,
            minWidth: "60px",
            selector: (row) =>
                <div className='dataTableIconBox'>
                    <button className='viewLinkBox' onClick={() => {
                        getLinks(row.id)
                    }}><File_ico className='fileViewIcon'/></button>
                     <Tooltip
                        anchorSelect=".viewLinkBox"
                        place="bottom"
                        content="View link Box"
                    />
                </div>

        },
        {
            name: "Order Status",
            minWidth: "140px",
            grow: 0,
            selector: (row) =>
                <div className='dataTableBox'>
                    <button className='commonOrderbtn' onClick={() => {
                        setFiledialogueBox1(true)
                        setids(row.id)
                        setcomplete(row.complete == "false" ? "true" : "false")
                    }}>{row.complete == "false" ? "Incomplete Order" : "Complete Order"}</button>
                </div>

        },
        {
            name: "Created at",
            minWidth: "140px",
            grow: 0,
            selector: (row) =>
            <div className='dataTableBox'>
                    <span style={{fontSize: "11px"}}>
                        {row.created_at.slice(0,10)}
                     </span>
            </div>

        },
        // {
        //     name: "Project Progress",
        //     selector: (row) =>
        //         <div className='dataTableBox'>
        //             <select onChange={(e) => ChangeProgress(row.id, e.target.value)}>
        //                 <option value={isGetAllProgress && isGetAllProgress.length > 0 ? 
        //                     isGetAllProgress.filter(data => data.id == row.progress).length > 0 ? 
        //                     isGetAllProgress.filter(data => data.id == row.progress)[0].progress : 0 : 0}>
        //                         {isGetAllProgress && isGetAllProgress.length > 0 ? isGetAllProgress.filter(data => data.id == row.progress).length > 0 ? isGetAllProgress.filter(data => data.id == row.progress)[0].progress : "Select" : "Select"}</option>
        //                 {
        //                     isGetAllProgress && isGetAllProgress.length > 0 ? isGetAllProgress.map(item => (
        //                         <>
        //                             {
        //                                 row.progress == item.id ? "" :
        //                                 <option value={item.id}>{item.progress}</option>
        //                             }
        //                         </>
        //                     )) : ""
        //                 }
        //             </select>
        //         </div>

        // },
        // {
        //     name: "Date",
        //     grow: 0,
        //     minWidth: "90px",
        //     selector: (row) =>
        //         <div className=''>
        //             {row.created_at ?
        //                 <span>{row.created_at.slice(0,10)}</span> :
        //                 <span className="notFoundMsg">Not Found</span>}
        //         </div>
        // },
    ]

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet (isOrdersData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer= XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs (data, "data" + fileExtension);
    }

    const handlePageChange = page => {
        setPage(parseInt(page) - 1)
    }
    useEffect(() => {
        getOrders(page)
    }, [page])

    useEffect(() => {
        getAllProgress()
    }, [])
   
    
    const OrderSearchFilter = (e) => {
        if (e.target.value == ' ') {
            setOrdersData(isFilterOrder)
        } else {
            setLoading(true)
            setDataLoader(false)
            setTimeout(() => {
                const filterResult = isFilterOrder.filter(item => 
                    item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.email.toLowerCase().includes(e.target.value.toLowerCase())||
                    item.number.toLowerCase().includes(e.target.value.toLowerCase())
                    || item.package_name.toLowerCase().includes(e.target.value.toLowerCase()) || 
                    item.amount.includes(e.target.value) ||
                    item.payment_method.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.created_at.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.order_progress.toLowerCase().includes(e.target.value.toLowerCase())
                    )
                setOrdersData(filterResult)
                setLoading(false)
                setDataLoader(true)
            }, 2000);
        }
        setFilterValue(e.target.value)
    }
    const ChageStatus = async (e) => {
        try {
            await fetch(`${config['baseUrl']}/orders/OrderCompleted`, {
                method: "POST",
                headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
                body: JSON.stringify({
                    "id": ids,
                    "complete": complete
                })
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.messsage == "unauthorized") {
                    fetch(`${config['baseUrl']}/orders/OrderCompleted`, {
                        method: "POST",
                        headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                        body: JSON.stringify({
                            "id": ids,
                            "complete": complete
                        })
                    }).then(response => {
                        return response.json()
                    }).then(response => {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        showAlert(response.message, "success")
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000)
                    }).catch((errs) => {
                        showAlert(errs.message, "success")
                    })
                }
                else if(response.messsage == "timeout error"){
                    localStorage.clear()
                    sessionStorage.clear()
                    window.location.href='/'
                }
                else {
                    showAlert(response.message, "success")
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            })
        } catch (error) { showAlert(error.message, "warning") }
    }
    const ChangeProgress = async (id, pro) => {
        try {
            await fetch(`${config['baseUrl']}/orders/UpdateOrderProgress`, {
                method: "POST",
                headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
                body: JSON.stringify({
                    "id": id,
                    "progress": parseInt(pro)
                })
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.messsage == "unauthorized") {
                    fetch(`${config['baseUrl']}/orders/UpdateOrderProgress`, {
                        method: "POST",
                        headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                        body: JSON.stringify({
                            "id": id,
                            "progress": parseInt(pro)
                        })
                    }).then(response => {
                        return response.json()
                    }).then(response => {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        showAlert("progress changed", "success")
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000)
                    }).catch((errs) => {
                        showAlert(errs.message, "success")
                    })
                }
                else if(response.messsage == "timeout error"){
                    localStorage.clear()
                    sessionStorage.clear()
                    window.location.href='/'
                }
                else {
                    showAlert("progress changed", "success")
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            })
        } catch (error) { showAlert(error.message, "warning") }
    }
    const filesHandler = async () => {
        setFiledialogueBox(!isFiledialogueBox)
        try {
            await fetch(`${config['baseUrl']}/clients/getOrderfiles`, {
                method: "GET",
                headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.messsage == "unauthorized") {
                    fetch(`${config['baseUrl']}/clients/getOrderfiles`, {
                        method: "GET",
                        headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                    }).then(response => {
                        return response.json()
                    }).then(response => {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        setFiles(response.data)
                    }).catch((errs) => { })
                }
                else if(response.messsage == "timeout error"){
                    localStorage.clear()
                    sessionStorage.clear()
                    window.location.href='/'
                }
                else {
                    setFiles(response.data)
                }
            })
        } catch (error) { }
    }
    const [showUpdateLinkModule, setshowUpdateLinkModule] = useState(false)
    const [linksData, setLinksData] = useState([]);
    const [linkGetErr, setlinkGetErr] = useState(false)
    const [linkdataLoader, setlinkDataLoader] = useState(false);
    const [linkloading, setlinkLoading] = useState(true);
    const getLinks = async (e) => {
        setshowUpdateLinkModule(!showUpdateLinkModule)
        await fetch(`${config['baseUrl']}/orderlinks/getOrderLinksByOrderIdForUser/${e}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/orderlinks/getOrderLinksByOrderIdForUser/${e}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setLinksData(response?.data)
                    setlinkDataLoader(true)
                }).catch((errs) => {
                    setlinkGetErr(errs.message)
                })
                .finally(() => {
                    setlinkLoading(false)
                })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setLinksData(response?.data)
                setlinkDataLoader(true)
            }
        }).catch((errs) => {
            setlinkGetErr(errs.message)
        })
        .finally(() => {
            setlinkLoading(false)
        })
    }

    return (
        <>
            <div className="orderBox">
                <h4 className='orderBoxHeadOne'>Orders Details</h4>
                <div className="innerOrderBox">
                    <div className="btnBox">
                        <button onClick={setCopied} className='copyBelow'><Copy_ico /></button>
                        <button className='makeExcelFile'onClick={(e)=> {exportToExcel()}}><Excel_ico /></button>
                        <button className='PrintFile' onClick={()=>{
                            handlehideShow()
                            handlePrint()
                        }}><Print_ico /></button>
                        <Tooltip
                            anchorSelect=".copyBelow"
                            place="bottom"
                            content="Copy Below Data"
                            style={{zIndex: "9999"}}
                        />
                        <Tooltip
                            anchorSelect=".makeExcelFile"
                            place="bottom"
                            content="Make Excel File of below Data"
                            style={{zIndex: "9999"}}
                        />
                        <Tooltip
                            anchorSelect=".makePDFFile"
                            place="bottom"
                            content="Make PDF File of below Data"
                            style={{zIndex: "9999"}}
                        />
                        <Tooltip
                            anchorSelect=".PrintFile"
                            place="bottom"
                            content="Print out of below data"
                            style={{zIndex: "9999"}}
                        />
                    </div>
                    <h4 className='orderBoxHeadTwo'>Orders Details</h4>
                    <SearchBar
                        {...{ OrderSearchFilter, isFilterValue }}
                    />
                </div>
                <ul>
                    {error && (
                        <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
                    )}
                    {linkGetErr && (
                        <li className={`alert alert-warning` + " " + "m-3"}>{`${linkGetErr}`}</li>
                    )}
                </ul>
                {loading && (
                    <div className="loaderBox">
                        <div className="loader">
                            <div className="one"></div>
                            <div className="two"></div>
                            <div className="three"></div>
                            <div className="four"></div>
                        </div>
                    </div>
                )}
                {dataLoader && (
                    <OrderDataTable
                        columns={columns}
                        data={isOrdersData}
                        highlightOnHover
                        pagination
                        paginationServer
                        paginationTotalRows={Isrows}
                        paginationComponentOptions={{
                            noRowsPerPage: true,
                        }}
                        customStyles={customStyles}
                        onChangePage={handlePageChange}
                    />

                )}
                {dataLoader && (
                    <div ref={componentRef}  id='hidediv' style={{display: "none"}}>
                        <table style={{width: "100%",padding: "50px"}}>
                        <thead className='printTableHead'>
                            <tr>
                                <th>Customer Details</th>
                                <th>Phone</th>
                                <th>Pack Details</th>
                                <th>Payment</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody className='printTableBody'>
                            {isOrdersData?.map((items)=> {
                                return(
                                    <tr key={items?.id}>
                                        <td style={{display: "flex",flexDirection: "column"}}>
                                           <span> {items?.name ? items?.name : "Not Found Name"}</span>
                                            <span>{items?.email ? items?.email : "Not Found Email"}</span>
                                        </td>
                                        <td>
                                            <span>{items?.number}</span>
                                        </td>
                                        <td style={{display: "flex",flexDirection: "column"}}>
                                           <span> {items?.package_name ? items?.package_name : "Not Found package name"}</span>
                                            <span>{items?.amount ? `${"$" + items?.amount}` : ""}</span>
                                        </td>
                                        <td>
                                            <span>{items?.payment_method ? items?.payment_method : "Not Found Payment Method"}</span>
                                        </td>
                                        <td>
                                           <span> {items?.created_at ? items?.created_at.slice(0,10) : "Not Found"}</span>
                                        </td>
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                        </table>
                    </div>
                )}
            </div>
            {isFiledialogueBox1 && (
                <>
                    <div className="orderStatusBox">
                        <div className="innerOrderStatusBox">
                            <h3><Close_ico onClick={() => { setFiledialogueBox1(false) }} /></h3>
                            <h5>Are you sure you want to change the status?</h5>
                            <div className="orderStatusBoxBtnBox">
                                <button onClick={() => ChageStatus()}>yes</button>
                                <button onClick={() => setFiledialogueBox1(false)}>no</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {isFiledialogueBox && (
                <>
                    <div className="orderfilesViewBox">
                        <div className="orderinnerfilesViewBox">
                            <h3>
                                <Close_ico onClick={() => { setFiledialogueBox(false) }} />
                            </h3>
                            <h5>Order Files</h5>
                            <div>
                                {
                                    isFiles && isFiles.length > 0 && isFiles.filter(data => data.order_id == ids).length > 0 ? isFiles.filter(data => data.order_id == ids).map((items) => {
                                        return (
                                            items.file?.match(/\.(jpg|jpeg|png|webp)$/) ?
                                                <>
                                                    <div className="orderfileItems">
                                                        <div className='orderfileFlex'>
                                                            <Picture_ico />
                                                            <span>{items.file.split('orderfiles/')[1].slice(0, 10)}</span>
                                                            <h5>
                                                                <a href={`https://payments-api.logomish.com${items.file!==null&&items.file!==undefined&&items.file!==""?items.file.split('/uploads')[1]:""}`} download={true} target='_blank'>
                                                                    <Download_ico />
                                                                </a>
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </> : items.file?.match(/\.(doc|docx)$/) ?
                                                    <>
                                                        <div className="orderfileItems">
                                                            <div className="orderfileFlex">
                                                                <img src={word_ico} alt="" />
                                                                <span>{items.file.split('orderfiles/')[1].slice(0, 10)}</span>
                                                                <h5>
                                                                    <a href={`https://payments-api.logomish.com${items.file!==null&&items.file!==undefined&&items.file!==""?items.file.split('/uploads')[1]:""}`} download={true} target='_blank'>
                                                                        <Download_ico />
                                                                    </a>
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </> : items.file?.match(/\.(xlsx|xls)$/) ?
                                                        <>
                                                            <div className="orderfileItems">
                                                                <div className="orderfileFlex">
                                                                    <img src={excel_ico} alt="" />
                                                                    <span>{items.file.split('orderfiles/')[1].slice(0, 10)}...</span>
                                                                    <h5>
                                                                        <a href={`https://payments-api.logomish.com${items.file!==null&&items.file!==undefined&&items.file!==""?items.file.split('/uploads')[1]:""}`} download={true} target='_blank'>
                                                                            <Download_ico />
                                                                        </a>
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                        </> : ""
                                        )
                                    }) : <span style={{ color: "white" }}>Not Found Files</span>
                                }
                            </div>
                        </div>
                    </div>
                </>
            )}

            {showUpdateLinkModule && (
                <>
                    {linkdataLoader && (
                        <div className="orderfilesViewBox">
                            <div className="orderinnerfilesViewBox">
                                <h3>
                                    <Close_ico onClick={() => { setshowUpdateLinkModule(false) }} />
                                </h3>
                                <h5>Order Links</h5>
                                {linkloading && (
                                    <div className="">
                                        <div className="loader">
                                            <div className="one"></div>
                                            <div className="two"></div>
                                            <div className="three"></div>
                                            <div className="four"></div>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    {linksData?.length>0 ? linksData.map((items) => {
                                        return(
                                            <>
                                                <div className="orderfileItems">
                                                    <div className='orderfileFlex' style={{justifyContent: "start"}}>
                                                        <span>
                                                            <a href={`${items.link}`}>{items.link.slice(0,30)}...</a>
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }) : <span style={{ color: "white" }}>Not Found Links</span>}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

{/* <PDFExport paperSize="A4" ref={pdfExportComponent}>
{dataLoader && (
                        <OrderDataTable
                            columns={columns}
                            data={isOrdersData}
                            highlightOnHover
                            pagination={false}
                            paginationServer
                            paginationPerPage={countPerPage}
                            paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
                            customStyles={customStyles} 
                        />

                )}
        </PDFExport> */}
        </>
    )
}

export default AllOrdersCom