export const config = {
    db: process.env.DB || "mongodb://admin:admin@localhost:27017/admin?retryWrites=true&w=majority",
    interval: process.env.INTERVAL || 20,
    token: process.env.WHATSAPP_TOKEN || "EAAOaZChJH7hoBAC3MNVBLfcpMEt9bSCFrk7Y8eVNUn0FDKbOWkzNNUU4PRI6Fjs4zEZBN1qIe0LMpQZBReZAZCSMA5JkZC7xe0uC5JSsQufEoJ3YYadiivWv8lzei5HCRPyccUt631r0qzN8G9tmEZCZBsjBJ7e7E5lgeGz921Rz7t4PPxYqLtu6qeSBd572rPESZAS3pOYuyaN5yqymftBhLnOi8X2bIZB5AZD",
    tokenVerification: process.env.WHATSAPP_TOKEN || "EAAOaZChJH7hoBAC3MNVBLfcpMEt9bSCFrk7Y8eVNUn0FDKbOWkzNNUU4PRI6Fjs4zEZBN1qIe0LMpQZBReZAZCSMA5JkZC7xe0uC5JSsQufEoJ3YYadiivWv8lzei5HCRPyccUt631r0qzN8G9tmEZCZBsjBJ7e7E5lgeGz921Rz7t4PPxYqLtu6qeSBd572rPESZAS3pOYuyaN5yqymftBhLnOi8X2bIZB5AZD"
}
