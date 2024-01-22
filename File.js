

export const content=(email)=>{
   const s=
`
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
      
    </style>
</head>
<body>
    <button class="btn btn-success" style="background-color: rgb(255, 87, 51);
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    border: none;">
        <a href="http://localhost:3000/user/verify?email=${email}">Verify account</a>
    </button>
    
</body>
</html>`
 return s
}