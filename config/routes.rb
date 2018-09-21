Rails.application.routes.draw do
  root 'welcome#index', as: :root

  use_doorkeeper

  #get 'books/index'
  #get 'books/show'
  #get 'books/create'
  #get 'books/update'
  #get 'books/destroy'
  #get 'book/index'
  #get 'book/show'
  #get 'book/create'
  #get 'book/update'
  #get 'book/destroy'
  #get 'welcome/index'
  delete  'books/destroyImage/:id',   to:   'books#destroyImage'
  get     'authors/typeahead/:query', to:   'authors#typeahead'

  get     'books/others',             to:   'books#others'
  put     'books/borrow/:id',         to:   'books#borrow'
  put     'books/return/:id',         to:   'books#return'
  post    'books/duplicate/:id',      to:   'books#duplicate'

  devise_for :users, :controllers => {sessions: 'sessions', registrations: 'registrations', passwords: 'passwords'}
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html



  devise_scope :user do
    authenticated :user do
      root 'welcome#index', as: :authenticated_root
    end
    unauthenticated do
      root 'welcome#index', as: :unauthenticated_root
      #root 'devise/sessions#new', as: :unauthenticated_root
    end
  end

    resources :books


    namespace :api do
      namespace :v1 do
        resources :users do
          get "current"
        end
        resources :books
      end
    end

end
