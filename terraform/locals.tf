locals {
  # Remember to change account-id in backend.tf - doesn't accept vars
  account-id = "978251882572"
  db-name    = "wordle"
  cert-arn   = "arn:aws:acm:eu-west-1:978251882572:certificate/f83ffc81-fd57-4c78-8907-0bce5d1f28fc"
}