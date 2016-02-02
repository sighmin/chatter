defmodule Chatter.NotificationsChannel do
  use Phoenix.Channel

  def join("notifications:general", message, socket) do
    {:ok, socket}
  end

  def handle_in("flash:message", msg, socket) do
    broadcast!(socket, "flash:message", %{type: msg["type"], body: msg["body"]})
    {:noreply, socket}
  end
end
