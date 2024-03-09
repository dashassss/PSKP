async function Delete() {
  const id = document.getElementById("fio").value;
  console.log(id);
  try {
    const response = await fetch(`/delete/${id}`, {
      method: 'POST'
    });
    if (response.ok) {
      window.location.href = '/';
    } else {
      console.error('Delete request failed:', response.status);
    }
  } catch (error) {
    console.error('Delete request failed:', error);
  }
}

function Change() {
  document.getElementById("deleteButton").disabled = true;
}