function upload(event)
{
    const api_key = document.getElementById('api_key').value;
    const img_url = document.getElementById('img_url').value;
    
    fetch( `https://api.imgbb.com/1/upload?key=${api_key}&image=${img_url}` )
        .then((response) => response.json())
        .then((data) => console.log(JSON.stringify(data, null, 2)))
        .catch((error)=> console.log('Error: ' + error));
}