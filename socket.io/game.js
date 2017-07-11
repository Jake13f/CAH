var users = {};

module.exports = (io) => {
  io.on("connection", (client) => {

    /**
     * Logs the user into the system
     * @param  {string} username the name to label the user
     * @param  {Function} cb a callback function letting the emit know the login status
     */
    client.on("login", (username, callback) => {
      if (users[username] == undefined) {
        client.username = username;
        users[username] = client;
        callback(true);
      } else {
        callback(false);
      }
    });

    /**
     * Checks whether the username is already in use
     * @param  {string} username the name to check for
     * @param  {Function} callback sends back the true or false if the name is ok to
     *                             use or not
     */
    client.on("check-name", (username, callback) => {
      if (users[username] == undefined)
        callback(true);
      else
        callback(false);
    });

    /**
     * Disconnect event
     * Removes the user from the collection
     */
    client.on("disconnect", () => {
      if (users[client.username] != undefined)
        delete users[client.username];
    });
  });
}
