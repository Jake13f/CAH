var users = {};

module.exports = (io) => {
  io.on("connection", (client) => {

    /**
     * Logs the user into the system
     * @param  {string} username the name to label the user
     * @param  {function} cb a callback function letting the emit know the login status
     */
    client.on("login", (username, cb) => {
      if (users[username] == undefined) {
        client.username = username;
        users[username] = client;
        cb(true);
      } else {
        cb(false);
      }
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
