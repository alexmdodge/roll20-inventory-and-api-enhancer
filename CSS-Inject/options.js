function loadData() {
  var txtOutput = document.getElementById("txtOutput")
  if (txtOutput) {
    txtOutput.style.width = '50%'
  }
}

function loadDeferred() {
  setTimeout(() => {
    loadData()
  }, 1000)
}

if (document.readyState === 'complete') {
  loadDeferred()
} else {
  document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      loadDeferred()
    }
  }
}