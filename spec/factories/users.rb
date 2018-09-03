FactoryBot.define do
  #fake=Faker
  #fake.seed(123)

  factory :user, class: User do
    id          1
    name        Faker::Name.name
    email       { "#{name.downcase.gsub(/\s+/, "")}@thenet.com" }
    password    Faker::Internet.password
  end
    
end

