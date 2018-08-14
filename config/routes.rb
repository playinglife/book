Rails.application.routes.draw do
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
  delete  'books/destroyImage/:id', to: 'books#destroyImage'

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

end
