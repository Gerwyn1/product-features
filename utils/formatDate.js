const formatDate = (passwordExpiresAt) => {
  const expirationDate = new Date(passwordExpiresAt);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
  const formattedDate = expirationDate.toLocaleString('en-US', options);
  return formattedDate;
}

export default formatDate;