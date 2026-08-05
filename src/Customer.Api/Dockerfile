# ============================
# BUILD STAGE
# ============================

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

COPY ["src/Customer.Api/Customer.Api.csproj", "src/Customer.Api/"]
COPY ["src/Shared.Contracts/Shared.Contracts.csproj", "src/Shared.Contracts/"]

RUN dotnet restore "src/Customer.Api/Customer.Api.csproj"

COPY . .

WORKDIR /src/src/Customer.Api

RUN dotnet publish "Customer.Api.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

# ============================
# RUNTIME STAGE
# ============================

FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet","Customer.Api.dll"]