# config/routes.rb — FRAGMENT: the catch-all goes LAST in the file.
# It only answers browser page loads, so API/XHR traffic is untouched.
get "*path", to: "spa#index",
    constraints: ->(req) { !req.xhr? && req.format.html }
