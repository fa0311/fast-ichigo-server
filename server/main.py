from aiohttp import web

from server.lib.socket import app

if __name__ == "__main__":
    web.run_app(app, host="0.0.0.0", port=8765)
