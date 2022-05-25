
export const defaultStylesheet= `
    w-auto {
        width:auto !important;
    }
    .b-brand-color-gray{
        background-color:#F8F8F8;
    }

    .b-brand-color-dark {
        background-color: #000000;
    }
    
    .b-brand-color-darken {
        background-color:#10122E; 
    }

    .b-brand-color-red {
        background-color:#EE3145; 
    }

    .b-brand-color-green {
        background-color:#77B454;
    }

    .b-brand-color-orange {
        background-color:#E1BB40;
    }

    .b-brand-color-gray {
        background-color:#8F8F8F;
    }

    .b-brand-light-gray {
        background-color:#F8F8F8;
    }

    .b-brand-color-white {
        background-color:white;
    }

    .b-brand-color-white td {
        color:black;
    }

    .b-brand-color-green td:first-child:before {
        background-color:#77B454;
    }

    .b-brand-color-green td:last-child:before {
        background-color:#77B454;
    }

    .b-brand-color-orange td:first-child:before {
        background-color:#E1BB40;
    }

    .b-brand-color-orange td:last-child:before {
        background-color:#E1BB40;
    }

    .b-brand-color-gray td:first-child:before {
        background-color:#8F8F8F;
    }

    .b-brand-color-gray td:last-child:before {
        background-color:#8F8F8F;
    }

    .b-brand-color-dark td:first-child:before {
        background-color:black; 
    }

    .b-brand-color-dark td:last-child:before {
        background-color:black; 
    }

    .b-brand-color-red td:first-child:before {
        background-color:#EE3145; 
    }

    .b-brand-color-red td:last-child:before {
        background-color:#EE3145; 
    }

    .b-brand-color-white td:first-child:before {
        background-color:white; 
    }

    .b-brand-color-white td:last-child:before {
        background-color:white; 
    }

    .custom-table {
        color:white;
    }

    .custom-table td {
        position: relative;
        border-bottom: 10px solid #F8F8F8;
        border-spacing: 0px;
        padding: 20px;
    }

    .table th {
        font-weight: normal !important;
        color: rgba(143, 143, 143, 1);
    }

    .custom-table td:first-child:before {
        content: "";
        display: block;
        width: 5px;
        height: 100%;
        left: -5px;
        top: 0;
        border-radius: 6px 0 0 6px;
        position: absolute;
    }

    .b-brand-color-white td:nth-child(2):before {
        background-color: rgba(248, 248, 248, 1);
    }

    .b-brand-color-white td:nth-child(3):before {
        background-color: rgba(248, 248, 248, 1);
    }

    .custom-table td:nth-child(4):before {
        background-color: rgba(248, 248, 248, 1);
    }

    .custom-table td:nth-child(5):before {
        background-color: rgba(248, 248, 248, 1);
    }

    .custom-table td:nth-child(6):before {
        background-color: rgba(248, 248, 248, 1);
    }

    .custom-table td:nth-child(7):after {
        background-color: rgba(248, 248, 248, 1);
    }

    .custom-table td:last-child:before {
        content: "";
        display: block;
        width: 20px;
        height: 100%;
        right: -5px;
        top: 0;
        border-radius: 0 6px 6px 0;
        position: absolute;
    }

    .custom-table tr:last-child td:first-child {
        border-radius: 0 0 0 6px;
    }

    .custom-table th:first-child {
        border-radius: 6px 0 0 0;
    }
    .custom-table th:last-child {
        border-radius: 0 6px 0 0;
    }
    .custom-table th:only-child{
        border-radius: 6px 6px 0 0;
    }
    .custom-table tr:last-child td:first-child {
        border-radius: 0 0 0 6px;
    }
    .align-left {
        text-align: left;
    }

    #root{
        display: flex;
        flex-wrap: nowrap;
        height: 100vh;
        height: -webkit-fill-available;
        max-height: 100vh;
        overflow-x: auto;
        overflow-y: hidden;
    }
    .f-18{
        font-size:18px;
    }
  
    tbody {
        overflow-y: auto;    /* Trigger vertical scroll    */
        overflow-x: hidden;  /* Hide the horizontal scroll */
    }

    tr {
        width: 100%;
        display: inline-table;
        table-layout: fixed;
    }
        
    table{
         max-height: 70vh;
        display: block;
    }
    tbody{
        overflow-y: scroll;      
        max-height: calc(100vh - 260px);
        width: 81%;
        position: absolute;
    }

    .table-scroll{
        height:calc(100vh - 260px);
        max-height: calc(100vh - 260px);
    }

    .pagination-buttons{
        position: absolute;
        bottom: 0;
        width: 78%;
    }

    #logoImage {
        max-width:240px
    }
`