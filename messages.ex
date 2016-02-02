# Error messages
Chatter.Endpoint.broadcast("notifications:general", "flash:message", %{type: "danger", body: "Hark! Functional languages are a mental jump for OOP brains!"})

# Notices
Chatter.Endpoint.broadcast("notifications:general", "flash:message", %{type: "info", body: "Info: Phoenix provides features that RoR and node.js excel at, and more!"})
