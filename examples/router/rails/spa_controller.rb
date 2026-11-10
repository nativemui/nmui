# app/controllers/spa_controller.rb — serves the built app shell
# (put the app in public/, as this repo's index.html setup does).
class SpaController < ApplicationController
  def index
    render file: Rails.public_path.join("index.html"),
           layout: false, content_type: "text/html"
  end
end
