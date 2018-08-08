FactoryBot.define do

  factory :book do
    id            1
    description   { "Description for book #{id}" }
    association :user, factory: :user
  end

  factory :book_ok, class: Book do
    id            2
    title         { "Title for book #{id}" }
    description   Faker::Lorem.paragraph
    association :user, factory: :user
  end

end

