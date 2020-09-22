const isLogging = process.env.REACT_APP_LOGGING_ON || false;
const logger = (sender , message) => {
    console.log("isLogging: " + isLogging);
    if(isLogging) { console.log(sender+": - "+ message); }
  }
  
export { logger };