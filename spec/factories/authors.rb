FactoryBot.define do

  factory :author, class: Author do
    id                1
    firstname         Faker::Name.first_name
    lastname          Faker::Name.last_name
    birthday          Faker::Date.between(1000.years.ago, Date.today)
  end
    
end


